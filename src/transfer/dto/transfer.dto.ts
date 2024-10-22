import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class TransferDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  readonly amount: number;

  @ApiProperty()
  @IsString()
  readonly recieverUsername: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly note?: string;
}
