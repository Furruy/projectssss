import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Role } from '../roles/entities/roles.entity';

import { RegisterUserRequestDto } from './dto/user-request.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(User) private readonly rolesRepository: Repository<Role>
  ) {}

  async createNewUser(createUserRequestDto: RegisterUserRequestDto): Promise<User> {
    const { ...userDto } = createUserRequestDto;

    const newUser = this.usersRepository.create({ ...userDto });

    return this.usersRepository.save(newUser);
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
}
