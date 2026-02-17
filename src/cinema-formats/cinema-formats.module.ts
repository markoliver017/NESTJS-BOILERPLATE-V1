import { Module } from '@nestjs/common';
import { CinemaFormatsService } from './cinema-formats.service';
import { CinemaFormatsController } from './cinema-formats.controller';
import { AudittrailModule } from '../audittrail/audittrail.module';

@Module({
  imports: [AudittrailModule],
  controllers: [CinemaFormatsController],
  providers: [CinemaFormatsService],
  exports: [CinemaFormatsService],
})
export class CinemaFormatsModule {}
