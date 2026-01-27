import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateAudittrailDto {
  @IsUUID()
  userId: string;

  @IsString()
  @MaxLength(255)
  controller: string;

  @IsString()
  @MaxLength(255)
  action: string;

  @IsOptional()
  @IsBoolean()
  isError?: boolean;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  stackTrace?: string;
}
