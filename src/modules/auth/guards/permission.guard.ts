import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { PermissionsEnum } from '@/common/enums/permission.enum';
import { Role } from '@/modules/roles/entities/roles.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private dataSource: DataSource
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<PermissionsEnum[]>('permissions', context.getHandler());

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roles) {
      throw new ForbiddenException('User not found or roles missing');
    }

    const userPermissions = await this.getUserPermissions(user.roles);

    const hasPermission = requiredPermissions.every((permission) => userPermissions.includes(permission));

    if (!hasPermission) {
      throw new ForbiddenException('Access Denied: Insufficient Permissions');
    }

    return true;
  }

  private async getUserPermissions(roleIds: number[]): Promise<PermissionsEnum[]> {
    const roles = await this.dataSource
      .getRepository(Role)
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .where('role.id IN (:...roleIds)', { roleIds })
      .getMany();

    const permissions = roles
      .flatMap((role) => role.permissions)
      .map((permission) => permission.name as PermissionsEnum);

    return Array.from(new Set(permissions));
  }
}
