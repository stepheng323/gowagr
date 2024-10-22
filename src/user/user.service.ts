import { Inject, Injectable } from '@nestjs/common';
import { UserRepo } from '../repo/userRepo';
import { AuthUser, IServiceHelper } from 'src/types';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Env } from '../lib/env.config';
import { LoginDto } from './dto/login.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { KyselyService } from '../db/db';
import { DB } from '../db/types';
import { AccountRepo } from '../repo/account.repo';

@Injectable()
export class UserService {
  constructor(
    private readonly client: KyselyService<DB>,
    private userRepo: UserRepo,
    private accountRepo: AccountRepo,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Signs up a new user and creates an account for them.
   *
   * @param {CreateUserDto} userPayload - The user's details for signup.
   * @returns {Promise<IServiceHelper>} A promise that resolves to an IServiceHelper object indicating the status of the signup operation.
   */
  async signup(userPayload: CreateUserDto): Promise<IServiceHelper> {
    const { email, password, username } = userPayload;
    const existingUserByEmail = await this.userRepo.findByEmail(email);
    if (existingUserByEmail)
      return {
        status: 'conflict',
        message: 'Email already in use',
      };

    const existingUserByUsername = await this.userRepo.findByUsername(username);
    if (existingUserByUsername)
      return {
        status: 'conflict',
        message: 'Username already in use',
      };

    const hashedPassword = await bcrypt.hash(password, 10);
    const userWithToken = await this.client
      .transaction()
      .execute(async (trx) => {
        const userData = await this.userRepo.create(
          {
            ...userPayload,
            password: hashedPassword,
          },
          trx,
        );
        await this.accountRepo.create(userData.id, trx);
        const token = jwt.sign(userData, Env.SECRET_KEY, {
          expiresIn: 30000,
        });
        return { ...userData, token };
      });

    return {
      status: 'successful',
      message: 'User signed up successfully',
      data: userWithToken,
    };
  }

  /**
   * Handles user login and returns a token if credentials are valid.
   *
   * @param {LoginDto} payload - The user's email and password for login.
   * @returns {Promise<IServiceHelper>} A promise that resolves to an IServiceHelper object indicating the status of the login operation.
   */
  async login(payload: LoginDto): Promise<IServiceHelper> {
    const user = await this.userRepo.findByEmail(payload.email);
    if (!user)
      return {
        status: 'bad-request',
        message: `Invalid email or password combination`,
      };
    const passwordMatch = await bcrypt.compare(payload.password, user.password);
    const cacheKey = `${payload.email}-login-retry`;
    const loginRetry = Number(await this.cacheManager.get(cacheKey)) || 1;
    const MAX_RETRY = 5;
    if (!passwordMatch) {
      if (loginRetry >= MAX_RETRY)
        return {
          status: 'forbidden',
          message: 'Your have been locked out, please contact support',
        };
      await this.cacheManager.set(cacheKey, loginRetry + 1);
      return {
        status: 'bad-request',
        message: `Invalid email or password, you have ${
          MAX_RETRY - loginRetry
        } attempt left`,
      };
    }
    if (loginRetry > 1) await this.cacheManager.del(cacheKey);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user;
    const token = jwt.sign(userData, Env.SECRET_KEY, {
      expiresIn: 30000,
    });
    return {
      status: 'successful',
      message: 'Login successful',
      data: { ...userData, token },
    };
  }

  /**
   * Fetches user details including their account balance.
   *
   * @param {AuthUser} user - The authenticated user.
   * @returns {Promise<IServiceHelper>} A promise that resolves to an IServiceHelper object containing the user's details and balance.
   */
  async getUserDetailsWithBalance(user: AuthUser): Promise<IServiceHelper> {
    const cacheKey = `account-balance-${user.id}`;
    let account = await this.cacheManager.get<{ balance: string }>(cacheKey);
    if (!account) {
      account = await this.accountRepo.getAccountBalanceByUserId(user.id);
      if (!account)
        return {
          status: 'not-found',
          message: 'Could not fetch account balance please try again',
        };
      await this.cacheManager.set(cacheKey, account, 60000); // Cache balance for 1 minute
    }
    return {
      status: 'successful',
      message: 'User balance fetched successfully',
      data: { ...user, ...account },
    };
  }

  /**
   * Fetches user details by their username.
   *
   * @param {string} username - The username of the user to fetch details for.
   * @returns {Promise<IServiceHelper>} A promise that resolves to an IServiceHelper object containing the user's details.
   */
  async getUserDetails(username: string): Promise<IServiceHelper> {
    const userDetails = await this.userRepo.findByUsername(username);
    if (!userDetails)
      return {
        status: 'not-found',
        message: 'User details not found',
      };
    return {
      status: 'successful',
      message: 'User details fetched successfully',
      data: userDetails,
    };
  }
}
