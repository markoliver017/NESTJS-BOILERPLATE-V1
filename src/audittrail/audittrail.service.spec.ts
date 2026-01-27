import { Test, TestingModule } from '@nestjs/testing';
import { AudittrailService } from './audittrail.service';

describe('AudittrailService', () => {
  let service: AudittrailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AudittrailService],
    }).compile();

    service = module.get<AudittrailService>(AudittrailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
