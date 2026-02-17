import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateCinemaFormatDto {
  @IsString()
  @MaxLength(20)
  code: string;

  @IsString()
  @MaxLength(60)
  label: string;

  @IsOptional()
  @IsString()
  description?: string;
}
