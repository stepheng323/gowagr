import {
  Controller,
  Post,
  Body,
  Res,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { convertResponse } from 'src/utils/response';
import { AuthGuard } from 'src/lib/guard/authGuard';
import { LoginDto } from './dto/login.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() CreateUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    const result = await this.userService.signup(CreateUserDto);
    return convertResponse(response, result);
  }

  @Post('login')
  async Login(@Body() loginDto: LoginDto, @Res() response: Response) {
    const result = await this.userService.login(loginDto);
    return convertResponse(response, result);
  }

  @Get('balance/:id')
  @UseGuards(AuthGuard)
  async fetchUserDetailsWithBalance(
    @Res() response: Response,
    @Param('id') userId: string,
  ) {
    const result = await this.userService.getUserDetailsWithBalance(userId);
    return convertResponse(response, result);
  }

  @Get('/:username')
  async fetchUserDetails(
    @Res() response: Response,
    @Param('username') username: string,
  ) {
    const result = await this.userService.getUserDetails(username);
    return convertResponse(response, result);
  }
}
