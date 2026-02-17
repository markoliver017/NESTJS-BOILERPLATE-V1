import { IsBoolean, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateCinemaFormatMapDto {
  @IsInt()
  @IsNotEmpty()
  cinemaId: number;

  @IsInt()
  @IsNotEmpty()
  cinemaFormatId: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  seatCount?: number;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
