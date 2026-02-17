import { Module } from '@nestjs/common';
import { TheatersService } from './theaters.service';
import { TheatersController } from './theaters.controller';
import { AudittrailModule } from '../audittrail/audittrail.module';

@Module({
  imports: [AudittrailModule],
  controllers: [TheatersController],
  providers: [TheatersService],
  exports: [TheatersService],
})
export class TheatersModule {}
