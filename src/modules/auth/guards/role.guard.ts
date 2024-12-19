import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { ROLES_KEY } from '@/common/decorators/role.devorator';
import { RolesEnum } from '@/common/enums/role.enum';
import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService
  ) {}

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

    const dataUser = await this.userService.findUserById(user.id);

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // const hasRole = dataUser?.userRoles.some((userRole) => roles.includes(userRole.role.id));

    // if (!hasRole) {
    //   throw new ForbiddenException('Insufficient permissions');
    // }

    // return true;
  }
}
