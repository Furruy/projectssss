import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '../roles/entities/roles.entity';

import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    @InjectRepository(Permission)
    private roleRepository: Repository<Role>
  ) {}

  async findAll(): Promise<Permission[]> {
    return this.permissionsRepository.find();
  }

  async create(createPermissionDto: any): Promise<any> {
    const permission = this.permissionsRepository.create(createPermissionDto);
    return this.permissionsRepository.save(permission);
  }

  async update(id: number, updatePermissionDto: any): Promise<Permission> {
    const permission = await this.permissionsRepository.findOne({ where: { id } });
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
    Object.assign(permission, updatePermissionDto);
    return this.permissionsRepository.save(permission);
  }

  async remove(id: number): Promise<void> {
    const permission = await this.permissionsRepository.findOne({ where: { id } });
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
    await this.permissionsRepository.remove(permission);
  }

  async findPermissionsByRole(roleId: number): Promise<any> {
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    const rolePermissions = await this.roleRepository
      .createQueryBuilder('role')
      .innerJoinAndSelect('role.permissions', 'permission')
      .where('role.id = :roleId', { roleId })
      .getMany();

    if (!rolePermissions || rolePermissions.length === 0) {
      return [];
    }

    return rolePermissions.map((rolePermission) => ({
      role: {
        id: rolePermission.id,
        name: rolePermission.name,
        description: rolePermission.description
      },
      permissions: rolePermission.permissions.map((permission) => ({
        id: permission.id,
        name: permission.name,
        description: permission.description
      }))
    }));
  }
}
