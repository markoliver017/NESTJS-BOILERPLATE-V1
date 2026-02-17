import { IsString, IsEmail, IsOptional, IsIn } from 'class-validator';
import type { UserRole } from '../../common/types/roles';
import { ROLE_LABELS } from '../../common/types/roles';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsIn(Object.keys(ROLE_LABELS))
  role?: UserRole;
}
