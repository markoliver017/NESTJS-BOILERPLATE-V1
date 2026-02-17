import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductionCompanyDto {
  @IsString()
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Transform(({ value }: { value: unknown }) =>
    value === '' ? undefined : value,
  )
  shortCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  @Transform(({ value }: { value: unknown }) =>
    value === '' ? undefined : value,
  )
  contactName?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(120)
  @Transform(({ value }: { value: unknown }) =>
    value === '' ? undefined : value,
  )
  contactEmail?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
