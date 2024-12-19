import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Permissions } from '@/common/decorators/permission.decorator';
import { Roles } from '@/common/decorators/role.devorator';
import { PermissionsEnum } from '@/common/enums/permission.enum';
import { RolesEnum } from '@/common/enums/role.enum';

import { PermissionsGuard } from '../auth/guards/permission.guard';
import { RolesGuard } from '../auth/guards/role.guard';

import { Permission } from './entities/permission.entity';
import { PermissionsService } from './permission.service';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({ status: 200, description: 'Return all permissions' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions(PermissionsEnum.READ_SECURE_DATA) // Chỉ người dùng có quyền READ_SECURE_DATA mới có thể truy cập
  async getPermissions() {
    return this.permissionsService.getPermissions();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new permission' })
  @ApiParam({ name: 'name', required: true })
  @ApiResponse({ status: 201, description: 'Permission added successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Post()
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(RolesEnum.ADMIN)
  @Permissions(PermissionsEnum.WRITE_SECURE_DATA)
  async addPermission(@Body() createPermissionDto: any): Promise<Permission> {
    return this.permissionsService.createPermission(createPermissionDto);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the permission' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Permission updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(RolesEnum.ADMIN)
  @Permissions(PermissionsEnum.UPDATE_SECURE_DATA)
  async updatePermission(@Param('id') id: string, @Body('newName') newName: string): Promise<Permission> {
    return this.permissionsService.updatePermission(id, newName);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete the permission' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Permission deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(RolesEnum.ADMIN)
  @Permissions(PermissionsEnum.DELETE_SECURE_DATA)
  async deletePermission(@Param('id') id: string): Promise<any> {
    return this.permissionsService.deletePermission(id);
  }

  @Post('/:roleId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign a permission to role by roleId' })
  @ApiParam({
    name: 'roleId',
    description: 'The unique identifier of the role to which you want to assign a permission',
    required: true,
    type: String
  })
  @ApiResponse({ status: 200, description: 'Permission successfully assigned to the role' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User or role not found' })
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(RolesEnum.ADMIN)
  @Permissions(PermissionsEnum.MANAGE_ROLES)
  async assignPermissionToRole(@Param('roleId') roleId: number, @Body('permissionId') permissionId: number) {
    await this.permissionsService.assignPermissionToRole(roleId, permissionId);
    return { message: 'Permission assigned successfully to role' };
  }

  @Get('/user')
  @UseGuards(PermissionsGuard)
  @Permissions(PermissionsEnum.VIEW_USER_PROFILES)
  async watchPermissionRole(@Body() body: { userId: string }) {
    return this.permissionsService.getPermissionsByUserId(body.userId);
  }
}
