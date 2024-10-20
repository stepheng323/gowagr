import { IsNegative, IsNumber, IsOptional, IsString } from 'class-validator';

export class TransferDto {
  @IsNegative()
  @IsNumber()
  readonly amount: number;

  @IsString()
  readonly username: string;

  @IsString()
  @IsOptional()
  readonly note?: string;
}
