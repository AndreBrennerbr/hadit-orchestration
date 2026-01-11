import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_NAME: z.string().min(1).default('hadit_db'),
  DB_USERNAME: z.string().min(1).default('user'),
  DB_PASSWORD: z.string().min(1).default('password'),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRATION_TIME: z
    .union([z.coerce.number().positive(), z.string().regex(/^\d+[smhd]$/)])
    .default('3600s'),
});

export type Env = z.infer<typeof envSchema> & {
  JWT_EXPIRATION_TIME: number | `${number}${'s' | 'm' | 'h' | 'd'}`;
};
