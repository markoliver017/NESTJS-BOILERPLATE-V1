import {
  IsString,
  IsOptional,
  MaxLength,
  IsBoolean,
  IsInt,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTheaterDto {
  @IsInt()
  theaterGroupId: number;

  @IsInt()
  taxRuleId: number;

  @IsString()
  @MaxLength(150)
  name: string;

  @IsString()
  address: string;

  @IsString()
  @MaxLength(80)
  city: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  @Transform(({ value }: { value: string | undefined }) =>
    value === '' ? undefined : value,
  )
  province?: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
