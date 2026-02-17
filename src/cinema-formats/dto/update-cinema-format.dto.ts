import { PartialType } from '@nestjs/mapped-types';
import { CreateCinemaFormatDto } from './create-cinema-format.dto';

export class UpdateCinemaFormatDto extends PartialType(CreateCinemaFormatDto) {}
