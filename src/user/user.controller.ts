import {
  Controller,
  Post,
  Body,
  Res,
  Param,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response, Request } from 'express';
import { convertResponse } from '../utils/response';
import { LoginDto } from './dto/login.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  ConflictResponseDto,
  CreateUserResponseDto,
} from './dto/signup-response.dto';
import {
  BadRequestResponse,
  NotAuthorizedResponse,
  NotFoundResponse,
} from '../dto/baseReponse';
import { AuthGuard } from '../lib/guard/authGuard';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'User signed up successfully.',
    type: CreateUserResponseDto,
  })
  @ApiConflictResponse({
    description: 'Email or username already in use',
    type: ConflictResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    type: BadRequestResponse,
  })
  async create(
    @Body() CreateUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    const result = await this.userService.signup(CreateUserDto);
    return convertResponse(response, result);
  }

  @Post('login')
  @ApiOkResponse({
    description: 'Login successfully.',
    type: CreateUserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid email or password combination',
    type: NotAuthorizedResponse,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    type: BadRequestResponse,
  })
  async Login(@Body() loginDto: LoginDto, @Res() response: Response) {
    const result = await this.userService.login(loginDto);
    return convertResponse(response, result);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('balance')
  @ApiOkResponse({ description: 'User balance fetched successfully' })
  @ApiNotFoundResponse({
    description: 'Could not fetch balance, please try again',
    type: NotFoundResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Please login',
    type: NotAuthorizedResponse,
  })
  async fetchUserDetailsWithBalance(
    @Res() response: Response,
    @Req() request: Request,
  ) {
    const user = request.user;
    const result = await this.userService.getUserDetailsWithBalance(user);
    return convertResponse(response, result);
  }

  @Get('/:username')
  @ApiOkResponse({ description: 'User details fetched successfully' })
  @ApiNotFoundResponse({
    description: 'User details not found',
    type: NotFoundResponse,
  })
  async fetchUserDetails(
    @Res() response: Response,
    @Param('username') username: string,
  ) {
    const result = await this.userService.getUserDetails(username);
    return convertResponse(response, result);
  }
}
