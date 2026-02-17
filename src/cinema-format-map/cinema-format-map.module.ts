import { Module } from '@nestjs/common';
import { CinemaFormatMapService } from './cinema-format-map.service';
import { CinemaFormatMapController } from './cinema-format-map.controller';
import { AudittrailModule } from '../audittrail/audittrail.module';

@Module({
  imports: [AudittrailModule],
  controllers: [CinemaFormatMapController],
  providers: [CinemaFormatMapService],
  exports: [CinemaFormatMapService],
})
export class CinemaFormatMapModule {}
