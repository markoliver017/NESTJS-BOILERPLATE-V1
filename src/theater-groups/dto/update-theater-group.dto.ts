import { PartialType } from '@nestjs/mapped-types';
import { CreateTheaterGroupDto } from './create-theater-group.dto';

export class UpdateTheaterGroupDto extends PartialType(CreateTheaterGroupDto) {}
