import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'user email', default: 'johndoe@gowagr.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'enter a secured password', default: 'password' })
  @IsString()
  readonly password: string;

  @ApiProperty({ description: 'enter a username', default: 'john' })
  @IsString()
  readonly username: string;
}
