import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Response } from 'express';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

jest.mock('../utils/response', () => ({
  convertResponse: jest.fn((response, result) => {
    if (result.status === true) {
      response.status(200).json(result);
    } else if (result.status === 'conflict') {
      response.status(409).json(result);
    } else if (result.status === 'forbidden') {
      response.status(403).json(result);
    } else {
      response.status(400).json(result);
    }
    return response;
  }),
}));

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            signup: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('create', () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
    };

    it('should create a new user successfully', async () => {
      const expectedResult = {
        data: {
          email: 'test@example.com',
          id: '1',
          token: 'mockToken',
          username: 'testuser',
        },
        message: 'User signed up successfully',
        status: true,
      };

      jest.spyOn(service, 'signup').mockResolvedValue(expectedResult as any);

      await controller.create(createUserDto, mockResponse);

      expect(service.signup).toHaveBeenCalledWith(createUserDto);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResult);
    });

    it('should handle email conflict response', async () => {
      const conflictResult = {
        status: 'conflict',
        message: 'Email already in use', // Updated to match exact error message
        data: null,
      };

      jest.spyOn(service, 'signup').mockResolvedValue(conflictResult as any);

      await controller.create(createUserDto, mockResponse);

      expect(service.signup).toHaveBeenCalledWith(createUserDto);
      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith(conflictResult);
    });

    it('should handle username conflict response', async () => {
      const conflictResult = {
        status: 'conflict',
        message: 'Username already in use', // Added separate test for username conflict
        data: null,
      };

      jest.spyOn(service, 'signup').mockResolvedValue(conflictResult as any);

      await controller.create(createUserDto, mockResponse);

      expect(service.signup).toHaveBeenCalledWith(createUserDto);
      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith(conflictResult);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login user successfully', async () => {
      const expectedResult = {
        status: true,
        message: 'Login successful',
        data: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          token: 'mockToken',
        },
      };

      jest.spyOn(service, 'login').mockResolvedValue(expectedResult as any);

      await controller.Login(loginDto, mockResponse);

      expect(service.login).toHaveBeenCalledWith(loginDto);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResult);
    });

    it('should handle invalid credentials', async () => {
      const errorResult = {
        status: 'bad-request',
        message: 'Invalid email or password, you have 4 attempt left',
      };

      jest.spyOn(service, 'login').mockResolvedValue(errorResult as any);

      await controller.Login(loginDto, mockResponse);

      expect(service.login).toHaveBeenCalledWith(loginDto);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResult);
    });

    it('should handle account lockout', async () => {
      const lockoutResult = {
        status: 'forbidden',
        message: 'Your have been locked out, please contact support',
      };

      jest.spyOn(service, 'login').mockResolvedValue(lockoutResult as any);

      await controller.Login(loginDto, mockResponse);

      expect(service.login).toHaveBeenCalledWith(loginDto);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith(lockoutResult);
    });
  });
});
