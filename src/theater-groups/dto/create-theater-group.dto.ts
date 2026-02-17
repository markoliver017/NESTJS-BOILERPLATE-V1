import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsBoolean,
  IsUrl,
} from 'class-validator';

export class CreateTheaterGroupDto {
  @IsString()
  @MaxLength(120)
  name: string;

  @IsString()
  @MaxLength(20)
  shortCode: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  @Transform(({ value }: { value: string | undefined }) =>
    value === '' ? undefined : value,
  )
  logoUrl?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  @Transform(({ value }: { value: string }) =>
    value === '' ? undefined : value,
  )
  website?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
