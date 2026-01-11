import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { DatabaseModuleModule } from '../database/database-module.module';
import { DataSource } from 'typeorm';
import { UserEntity } from 'src/users/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from 'src/config/jwt-config/jwt-config.service';
import { AppConfigModule } from 'src/config/config.module';
import { AuthGuard } from './auth.guard';

@Module({
  providers: [
    AuthService,
    {
      provide: 'USERS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(UserEntity),
      inject: ['DATA_SOURCE'],
    },
    UsersService,
    AuthGuard,
  ],
  controllers: [AuthController],
  imports: [
    AppConfigModule,
    DatabaseModuleModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [JwtConfigService],
      useFactory: (jwtconfig: JwtConfigService) => ({
        secret: jwtconfig.secret,
        signOptions: { expiresIn: jwtconfig.expirationTime },
      }),
    }),
  ],
  exports: [AuthService, JwtModule, AuthGuard],
})
export class AuthModule {}
