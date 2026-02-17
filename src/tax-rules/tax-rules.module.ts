import { Module } from '@nestjs/common';
import { TaxRulesController } from './tax-rules.controller';
import { TaxRulesService } from './tax-rules.service';
import { AudittrailModule } from '../audittrail/audittrail.module';

@Module({
  imports: [AudittrailModule],
  controllers: [TaxRulesController],
  providers: [TaxRulesService],
  exports: [TaxRulesService],
})
export class TaxRulesModule {}
