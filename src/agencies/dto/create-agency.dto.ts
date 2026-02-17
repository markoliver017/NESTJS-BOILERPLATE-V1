import { IsString, IsEmail, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateAgencyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  contactPerson: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  phone: string;
}
