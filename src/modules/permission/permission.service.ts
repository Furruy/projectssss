import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '../roles/entities/roles.entity';
import { User } from '../users/entities/user.entity';

import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    @InjectRepository(Permission)
    private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async createPermission(createPermissionDto: any): Promise<Permission> {
    const { name, description } = createPermissionDto;

    const existingPermission = await this.permissionsRepository.findOne({ where: { name } });
    if (existingPermission) {
      throw new BadRequestException('Permission already exists');
    }

    if (!name) {
      throw new BadRequestException('Permission name is required');
    }

    const newPermission = this.permissionsRepository.create({ name, description });
    return await this.permissionsRepository.save(newPermission);
  }

  async updatePermission(permissionId: string, newName: string): Promise<any> {
    const permission = await this.permissionsRepository.findOneBy({ id: Number(permissionId) });
    if (!permission) {
      throw new Error('Permission not found');
    }

    permission.name = newName;
    return await this.permissionsRepository.save(permission);
  }

  async deletePermission(permissionId: string): Promise<any> {
    const permission = await this.permissionsRepository.findOneBy({ id: Number(permissionId) });
    if (!permission) {
      throw new Error('Permission not found');
    }

    return await this.permissionsRepository.remove(permission);
  }

  async getPermissions() {
    return await this.permissionsRepository.find();
  }

  async assignPermissionToRole(roleId: number, permissionId: number): Promise<any> {
    const role = await this.roleRepository.findOne({ where: { id: roleId }, relations: ['permissions'] });
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    const permission = await this.permissionsRepository.findOne({ where: { id: permissionId } });
    if (!permission) {
      throw new BadRequestException('Permission not found');
    }

    if (!role.permissions) {
      return { message: 'Role does not have any permissions' };
    }

    await this.roleRepository
      .createQueryBuilder()
      .insert()
      .into('role_permissions')
      .values({
        role_id: roleId,
        permission_id: permissionId
      })
      .execute();

    return { roleId, permissionId, message: 'Permission assigned successfully' };
  }

  async getPermissionsByUserId(userId: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions']
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user.roles.map((role) => role.permissions).flat();
  }
}
