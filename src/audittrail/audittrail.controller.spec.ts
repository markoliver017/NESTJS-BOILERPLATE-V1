import { Test, TestingModule } from '@nestjs/testing';
import { AudittrailController } from './audittrail.controller';
import { AudittrailService } from './audittrail.service';

describe('AudittrailController', () => {
  let controller: AudittrailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AudittrailController],
      providers: [AudittrailService],
    }).compile();

    controller = module.get<AudittrailController>(AudittrailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
