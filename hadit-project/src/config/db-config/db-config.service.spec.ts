import { Test, TestingModule } from '@nestjs/testing';
import { DbConfigService } from './db-config.service';
import { ConfigService } from '@nestjs/config';

describe('DbConfigService', () => {
  let service: DbConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DbConfigService,
        {
          provide: ConfigService,
          useValue: { getOrThrow: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<DbConfigService>(DbConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
