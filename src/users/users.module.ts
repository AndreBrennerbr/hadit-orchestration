import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './entity/user.entity';
import { DataSource } from 'typeorm';
import { DatabaseModuleModule } from '../database-module/database-module.module';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [DatabaseModuleModule],
  controllers: [UsersController],
  providers: [
    {
      provide: 'USERS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(UserEntity),
      inject: ['DATA_SOURCE'],
    },
    UsersService,
    AuthGuard,
  ],
  exports: [UsersService],
})
export class UsersModule {}
