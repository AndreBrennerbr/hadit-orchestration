import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  Healthcheck(): string {
    return { health: 'ok' }.toString();
  }
}
