import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from './entities/roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>
  ) {}

  async findAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  async create(createRoleDto: any): Promise<any> {
    const role = this.rolesRepository.create(createRoleDto);
    return this.rolesRepository.save(role);
  }

  async update(id: number, updateRoleDto: any): Promise<Role> {
    const result = await this.rolesRepository.update(id, updateRoleDto);

    if (result.affected === 0) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }

    return await this.rolesRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    const role = await this.rolesRepository.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }

    if (role.isSuperAdmin) {
      throw new Error('Cannot delete Super Admin role');
    }

    await this.rolesRepository.remove(role);
  }
}
