import { ApiProperty } from '@nestjs/swagger';

export class NotFoundResponse {
  @ApiProperty({ example: false, description: 'A failed response' })
  status: boolean;

  @ApiProperty({
    example: 'Not found',
    description: 'Response message',
  })
  message: string;
}

export class NotAuthorizedResponse {
  @ApiProperty({ example: false, description: 'A failed response' })
  status: boolean;

  @ApiProperty({
    example: 'Please login to continue',
    description: 'Enter a valid token',
  })
  message: string;
}

export class BadRequestResponse {
  @ApiProperty({ example: false, description: 'A failed response' })
  status: boolean;

  @ApiProperty({
    example: 'Bad request',
    description: 'Bad request',
  })
  message: string;
}
