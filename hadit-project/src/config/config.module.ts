import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env.schema';
import { JwtConfigService } from './jwt-config/jwt-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => {
        const parsed = envSchema.safeParse(env);

        if (!parsed.success) {
          throw new Error('Invalid environment variables');
        }

        return parsed.data;
      },
    }),
  ],
  providers: [JwtConfigService],
  exports: [JwtConfigService],
})
export class AppConfigModule {}
