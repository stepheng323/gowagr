import { IsString, IsOptional } from 'class-validator';

export class paginateDto {
  @IsOptional()
  @IsString({ message: 'PerPage should be a string' })
  perPage: number;

  @IsOptional()
  @IsString({ message: 'Page should be a string' })
  page: number;
}
