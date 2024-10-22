import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserRepo } from '../repo/userRepo';
import { AccountRepo } from '../repo/account.repo';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Env } from '../lib/env.config';
import { KyselyService } from '../db/db';
import { UserService } from './user.service';
import { Test } from '@nestjs/testing';

// Mock bcrypt and jwt at the top level
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let userRepo: UserRepo;
  let accountRepo: AccountRepo;
  let kyselyService: KyselyService<any>;

  const mockTransaction = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: KyselyService,
          useValue: {
            transaction: jest.fn().mockReturnValue(mockTransaction),
          },
        },
        {
          provide: UserRepo,
          useValue: {
            findByEmail: jest.fn(),
            findByUsername: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: AccountRepo,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepo = module.get<UserRepo>(UserRepo);
    accountRepo = module.get<AccountRepo>(AccountRepo);
    kyselyService = module.get<KyselyService<any>>(KyselyService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('signup', () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
    };

    beforeEach(() => {
      // Set up mock implementations before each test
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');
    });

    it('should create a new user and account successfully', async () => {
      const mockUserData = {
        id: 1,
        ...createUserDto,
        password: 'hashedPassword',
      };

      jest.spyOn(userRepo, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(userRepo, 'findByUsername').mockResolvedValue(null);
      jest.spyOn(userRepo, 'create').mockResolvedValue(mockUserData as any);
      jest
        .spyOn(accountRepo, 'create')
        .mockResolvedValue({ id: '1', balance: '0' });

      mockTransaction.execute.mockImplementation(async (callback) => {
        const result = await callback(mockTransaction);
        return result;
      });

      const result = await service.signup(createUserDto);

      expect(result).toEqual({
        status: 'created',
        message: 'User signed up successfully',
        data: {
          ...mockUserData,
          token: 'mockToken',
        },
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(userRepo.create).toHaveBeenCalledWith(
        {
          ...createUserDto,
          password: 'hashedPassword',
        },
        mockTransaction,
      );
      expect(accountRepo.create).toHaveBeenCalledWith(1, mockTransaction);
      expect(jwt.sign).toHaveBeenCalledWith(mockUserData, Env.SECRET_KEY, {
        expiresIn: 30000,
      });
    });

    it('should return conflict when email already exists', async () => {
      jest.spyOn(userRepo, 'findByEmail').mockResolvedValue({ id: 1 } as any);

      const result = await service.signup(createUserDto);

      expect(result).toEqual({
        status: 'conflict',
        message: 'Email already in use',
      });
      expect(userRepo.create).not.toHaveBeenCalled();
      expect(accountRepo.create).not.toHaveBeenCalled();
    });

    it('should return conflict when username already exists', async () => {
      jest.spyOn(userRepo, 'findByEmail').mockResolvedValue(null);
      jest
        .spyOn(userRepo, 'findByUsername')
        .mockResolvedValue({ id: 1 } as any);

      const result = await service.signup(createUserDto);

      expect(result).toEqual({
        status: 'conflict',
        message: 'Username already in use',
      });
      expect(userRepo.create).not.toHaveBeenCalled();
      expect(accountRepo.create).not.toHaveBeenCalled();
    });
  });
});