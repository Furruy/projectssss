import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { RolesEnum } from '@/common/enums/role.enum';

import { Role } from '../roles/entities/roles.entity';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(User) private readonly rolesRepository: Repository<Role>
  ) {}

  async createNewUser(createUserRequestDto: any): Promise<any> {
    const { ...userDto } = createUserRequestDto;

    const newUser = this.usersRepository.create({
      ...userDto,
      roles: [Object.assign(new Role(), { id: RolesEnum.USER })]
    });

    return this.usersRepository.save(newUser);
  }

  async removeRoleFromUser(userId: string, roleId: number): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles']
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = await this.rolesRepository.findOne({ where: { id: roleId } });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    user.roles = user.roles.filter((userRole) => userRole.id !== role.id);

    await this.usersRepository.save(user);
    return { message: 'Role removed successfully from the user' };
  }

  async getPermissionsByUserId(userId: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions']
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.roles.map((role) => role.permissions).flat();
  }

  async getAllRolesUser(userId: string): Promise<any> {
    return await this.usersRepository.findOne({ where: { id: userId }, relations: ['roles'] });
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findUserById(id: string): Promise<User> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('invalid_id');
    }

    const user = await this.usersRepository.findOne({ where: { id }, relations: ['roles'] });

    if (!user) {
      throw new NotFoundException('user_not_found');
    }

    return user;
  }

  async findUsersByIds(ids: string[], relations: string[] = []): Promise<User[]> {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('invalid_ids');
    }

    const users = await this.usersRepository.find({
      where: { id: In(ids) },
      relations: relations
    });

    if (users.length === 0) {
      throw new NotFoundException('user.not_found');
    }

    return users;
  }

  async updatePassword(id: string, newPassword: string): Promise<User> {
    const user = await this.findUserById(id);
    user.password = newPassword;
    return this.usersRepository.save(user);
  }

  async assignRoleToUser(userId: string, roleId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles']
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = await this.rolesRepository.findOne({ where: { id: roleId } });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (user.roles.some((userRole) => userRole.id === role.id)) {
      throw new NotFoundException('User already has this role');
    }

    user.roles.push(role);

    await this.usersRepository.save(user);

    return { message: 'Role assigned successfully to the user' };
  }
}
