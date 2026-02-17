import { Module } from '@nestjs/common';
import { ProductionCompaniesService } from './production-companies.service';
import { ProductionCompaniesController } from './production-companies.controller';
import { AudittrailModule } from '../audittrail/audittrail.module';

@Module({
  imports: [AudittrailModule],
  controllers: [ProductionCompaniesController],
  providers: [ProductionCompaniesService],
  exports: [ProductionCompaniesService],
})
export class ProductionCompaniesModule {}
