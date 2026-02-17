import { Module } from '@nestjs/common';
import { TheaterGroupsService } from './theater-groups.service';
import { TheaterGroupsController } from './theater-groups.controller';
import { AudittrailModule } from '../audittrail/audittrail.module';

@Module({
  imports: [AudittrailModule],
  controllers: [TheaterGroupsController],
  providers: [TheaterGroupsService],
  exports: [TheaterGroupsService],
})
export class TheaterGroupsModule {}
