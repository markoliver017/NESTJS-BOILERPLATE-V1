import {
  IsString,
  IsInt,
  MaxLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateCinemaDto {
  @IsInt()
  theaterId: number;

  @IsString()
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsInt()
  geofenceRadius?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
