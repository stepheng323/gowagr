import { Injectable } from '@nestjs/common';
import { UserRepo } from 'src/repo/userRepo';
import { IServiceHelper } from 'src/types/index';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepo) { }

  async signup(userPayload: CreateUserDto): Promise<IServiceHelper> {
    const orders = await this.userRepo.create(userPayload);
    return {
      status: 'successful',
      message: 'User signed up successfully',
      data: orders,
    };
  }
}
