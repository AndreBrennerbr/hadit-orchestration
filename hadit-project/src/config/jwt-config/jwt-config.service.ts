import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from '../env.schema';

@Injectable()
export class JwtConfigService {
  constructor(private readonly configService: ConfigService<Env>) {}

  get secret(): string {
    return this.configService.getOrThrow<string>('JWT_SECRET', { infer: true });
  }

  get expirationTime(): Env['JWT_EXPIRATION_TIME'] {
    return this.configService.getOrThrow('JWT_EXPIRATION_TIME');
  }
}
