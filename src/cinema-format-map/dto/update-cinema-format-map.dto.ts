import { PartialType } from '@nestjs/mapped-types';
import { CreateCinemaFormatMapDto } from './create-cinema-format-map.dto';

export class UpdateCinemaFormatMapDto extends PartialType(
  CreateCinemaFormatMapDto,
) {}
