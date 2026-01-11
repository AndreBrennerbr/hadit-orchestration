import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from '../env.schema';

@Injectable()
export class DbConfigService {
  constructor(private readonly configService: ConfigService<Env>) {}

  get databaseName(): string {
    return this.configService.getOrThrow<string>('DATABASE_NAME', {
      infer: true,
    });
  }

  get username(): string {
    return this.configService.getOrThrow<string>('DB_USERNAME', {
      infer: true,
    });
  }

  get password(): string {
    return this.configService.getOrThrow<string>('DB_PASSWORD', {
      infer: true,
    });
  }
}
