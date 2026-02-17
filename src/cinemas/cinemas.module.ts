import { Module } from '@nestjs/common';
import { CinemasService } from './cinemas.service';
import { CinemasController } from './cinemas.controller';
import { AudittrailModule } from '../audittrail/audittrail.module';

@Module({
  imports: [AudittrailModule],
  controllers: [CinemasController],
  providers: [CinemasService],
  exports: [CinemasService],
})
export class CinemasModule {}
