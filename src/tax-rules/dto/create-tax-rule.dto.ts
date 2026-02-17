import {
  IsString,
  IsOptional,
  IsDecimal,
  MaxLength,
  IsEnum,
} from 'class-validator';

export class CreateTaxRuleDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsEnum(['gross_based', 'ticket_based', 'custom'])
  formulaType: 'gross_based' | 'ticket_based' | 'custom';

  @IsString()
  @IsDecimal({ decimal_digits: '0,2' })
  taxRate: string;

  @IsString()
  @IsDecimal({ decimal_digits: '0,2' })
  divisor: string;

  @IsOptional()
  @IsString()
  description?: string;
}
