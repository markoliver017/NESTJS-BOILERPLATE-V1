import { Module } from '@nestjs/common';
import { AudittrailService } from './audittrail.service';
import { AudittrailController } from './audittrail.controller';

@Module({
  controllers: [AudittrailController],
  providers: [AudittrailService],
  exports: [AudittrailService],
})
export class AudittrailModule {}
