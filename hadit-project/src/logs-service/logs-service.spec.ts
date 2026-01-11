import { Test, TestingModule } from '@nestjs/testing';
import { LogsService } from './logs-service';

describe('LogsService', () => {
  let provider: LogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogsService],
    }).compile();

    provider = module.get<LogsService>(LogsService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
