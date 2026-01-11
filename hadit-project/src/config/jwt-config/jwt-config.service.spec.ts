import { Test, TestingModule } from '@nestjs/testing';
import { JwtConfigService } from './jwt-config.service';
import { ConfigService } from '@nestjs/config';

describe('JwtConfigService', () => {
  let service: JwtConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtConfigService,
        {
          provide: ConfigService,
          useValue: { getOrThrow: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<JwtConfigService>(JwtConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
