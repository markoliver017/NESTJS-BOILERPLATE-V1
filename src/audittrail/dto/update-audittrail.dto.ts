import { PartialType } from '@nestjs/mapped-types';
import { CreateAudittrailDto } from './create-audittrail.dto';

export class UpdateAudittrailDto extends PartialType(CreateAudittrailDto) {}
