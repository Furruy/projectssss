import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Permissions } from '@/common/decorators/permission.decorator';
import { Roles } from '@/common/decorators/role.devorator';
import { PermissionsEnum } from '@/common/enums/permission.enum';
import { RolesEnum } from '@/common/enums/role.enum';

import { RolesGuard } from '../auth/guards/role.guard';

import { CreateRoleDto } from './dto/role-equest.dto';
import { Role } from './entities/roles.entity';
import { RolesService } from './role.service';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'Returns all roles' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Permissions(PermissionsEnum.VIEW_ROLE)
  async findAll(): Promise<Role[]> {
    return await this.rolesService.findAll();
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully', type: Role })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Permissions(PermissionsEnum.CREATE_ROLE)
  async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return await this.rolesService.create(createRoleDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing role' })
  @ApiResponse({ status: 200, description: 'Role updated successfully', type: Role })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Permissions(PermissionsEnum.UPDATE_ROLE)
  async update(@Param('id') id: number, @Body() updateRoleDto: any): Promise<Role> {
    return await this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a role by ID' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Permissions(PermissionsEnum.DELETE_ROLE)
  async remove(@Param('id') id: number): Promise<void> {
    return this.rolesService.remove(id);
  }
}
