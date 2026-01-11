import { Module } from '@nestjs/common';
import { databaseProviders } from './database-provivers';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModuleModule {}
