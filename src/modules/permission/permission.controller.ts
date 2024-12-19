import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { permission } from 'process';

import { Roles } from '@/common/decorators/role.devorator';
import { RolesEnum } from '@/common/enums/role.enum';

import { PermissionRequestDto } from './dto/permission-request.dto';
import { Permission } from './entities/permission.entity';
import { PermissionsService } from './permission.service';

// @UseGuards(AuthGuard, RolesGuard)
@Roles(RolesEnum.SuperAdmin)
@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({ status: 200, description: 'Returns all permissions', type: [Permission] })
  async findAll(): Promise<Permission[]> {
    return this.permissionsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiResponse({ status: 201, description: 'Permission created successfully', type: Permission })
  async create(@Body() createPermissionDto: PermissionRequestDto): Promise<Permission> {
    return this.permissionsService.create(createPermissionDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a permission' })
  @ApiResponse({ status: 200, description: 'Permission updated successfully', type: Permission })
  async update(@Param('id') id: number, @Body() updatePermissionDto: any): Promise<Permission> {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a permission' })
  @ApiResponse({ status: 200, description: 'Permission deleted successfully' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.permissionsService.remove(id);
  }
}
