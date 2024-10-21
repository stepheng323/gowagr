import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsString()
  @ApiProperty({
    example: 'john@example.com',
    description: "The user's email",
  })
  readonly email: string;

  @IsString()
  @ApiProperty({
    example: 'password123',
    description: "The user's password",
  })
  readonly password: string;
}
