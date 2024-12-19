import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

import { Permission } from './entities/permission.entity';
import { PermissionsController } from './permission.controller';
import { PermissionsService } from './permission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
    forwardRef(() => AuthModule),
    forwardRef(() => JwtModule),
    forwardRef(() => UsersModule)
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService, ConfigService],
  exports: []
})
export class PermissionModule {}
