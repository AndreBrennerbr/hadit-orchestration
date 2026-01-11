import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './entity/user.entity';
import { DataSource } from 'typeorm';
import { DatabaseModuleModule } from '../database/database-module.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModuleModule, AuthModule],
  controllers: [UsersController],
  providers: [
    {
      provide: 'USERS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(UserEntity),
      inject: ['DATA_SOURCE'],
    },
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
