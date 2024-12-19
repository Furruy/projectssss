import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { User } from '../users/entities/user.entity';

import { Role } from './entities/roles.entity';
import { RolesController } from './role.controller';
import { RolesService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User]), forwardRef(() => AuthModule), forwardRef(() => JwtModule)],
  controllers: [RolesController],
  providers: [RolesService, ConfigService],
  exports: []
})
export class RolesModule {}
