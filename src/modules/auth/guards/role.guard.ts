import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '@/common/decorators/role.devorator';
import { RolesEnum } from '@/common/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<RolesEnum[]>(ROLES_KEY, context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];
    const user = request.headers['user'];

    if (!token) {
      throw new ForbiddenException('No token provided');
    }

    if (request.isSuperAdmin) {
      return true;
    }

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (!roles) {
      return true;
    }

    return roles.some((role) => user.roles.includes(role));
  }
}
