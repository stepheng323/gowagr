import { ApiProperty } from '@nestjs/swagger';

class UserData {
  @ApiProperty({
    example: '4e8a9920-23ba-425d-beb9-0b5cc6743441',
    description: 'Generated user id',
  })
  id: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: "The user's authentication token",
  })
  token: string;

  @ApiProperty({ example: 'john@example.com', description: "The user's email" })
  email: string;

  @ApiProperty({ example: 'john32', description: "The user's username" })
  username: string;

  @ApiProperty({
    example: '2024-10-20T13:29:36.129Z',
    description: 'Timestamp of user creation',
  })
  createdAt: string;
}

export class CreateUserResponseDto {
  @ApiProperty({ example: false, description: 'Response status' })
  status: boolean;

  @ApiProperty({
    example: 'User created successfully',
    description: 'Response message',
  })
  message: string;

  @ApiProperty({
    description: 'Data object containing user information',
    type: UserData,
  })
  data: UserData;
}

export class ConflictResponseDto {
  @ApiProperty({ example: false, description: 'A failed response' })
  status: boolean;

  @ApiProperty({
    example: 'Email or username already in use',
    description: 'Conflict',
  })
  message: string;
}
