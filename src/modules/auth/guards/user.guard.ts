import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { User } from '@/modules/users/entities/user.entity';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;

    if (!userId) {
      return false;
    }

    const user = await this.dataSource.getRepository(User).findOne({
      where: { id: userId },
      relations: ['roles']
    });

    if (!user) {
      return false;
    }

    request.user = user;
    return true;
  }
}
