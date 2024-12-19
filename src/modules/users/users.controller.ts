import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { Permissions } from '@/common/decorators/permission.decorator';
import { Roles } from '@/common/decorators/role.devorator';
import { PermissionsEnum } from '@/common/enums/permission.enum';
import { RolesEnum } from '@/common/enums/role.enum';
import { RequestWithUser } from '@/common/types/index.e';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Permission } from '../permission/entities/permission.entity';

import { GetUserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get the logged in user's details" })
  @ApiResponse({ status: 200, description: "Returns the logged in user's details", type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtGuard)
  async getMe(@Req() { user }: RequestWithUser): Promise<GetUserResponseDto> {
    return plainToClass(GetUserResponseDto, user, { excludeExtraneousValues: true });
  }

  @Get(':userId/roles')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all roles associated with the user by user ID' })
  @ApiParam({
    name: 'userId',
    description: 'The unique identifier of the user whose roles you want to fetch',
    required: true,
    type: String
  })
  @ApiResponse({ status: 200, description: 'Return all roles associated with the user', type: [User] })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(JwtGuard)
  @Permissions(PermissionsEnum.VIEW_USER_PROFILES)
  async getRoles(@Param('userId') userId: string): Promise<any> {
    return this.usersService.getAllRolesUser(userId);
  }

  @Post(':userId/roles')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign a role to the user by user ID' })
  @ApiParam({
    name: 'userId',
    description: 'The unique identifier of the user to whom you want to assign a role',
    required: true,
    type: String
  })
  @ApiResponse({ status: 200, description: 'Role successfully assigned to the user' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User or role not found' })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Permissions(PermissionsEnum.ASSIGN_ROLE)
  async assignRole(@Param('userId') userId: string, @Body() body: { roleId: string }): Promise<any> {
    if (!body.roleId) {
      throw new BadRequestException('role_id_required');
    }

    await this.usersService.assignRoleToUser(userId, Number(body.roleId));
    return { message: 'Role successfully assigned to the user' };
  }

  @Delete(':userId/roles')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a role from the user by user ID' })
  @ApiParam({
    name: 'userId',
    description: 'The unique identifier of the user from whom you want to remove a role',
    required: true,
    type: String
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Permissions(PermissionsEnum.REMOVE_ROLE) // Thêm quyền để xóa vai trò
  async removeRole(@Param('userId') userId: string, @Body() body: { roleId: string }): Promise<any> {
    return this.usersService.removeRoleFromUser(userId, Number(body.roleId));
  }

  @Post('/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find user by ID' })
  @Roles(RolesEnum.ADMIN)
  @Permissions(PermissionsEnum.VIEW_USER) // Thêm quyền để tìm người dùng
  async findUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.findUserById(id);
  }

  @Get('/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @Roles(RolesEnum.ADMIN)
  @Permissions(PermissionsEnum.VIEW_USER) // Thêm quyền để lấy người dùng theo ID
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.findUserById(id);
  }

  @Get('/permission')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async getPermission(@Req() req: RequestWithUser): Promise<Permission> {
    return this.usersService.getPermissionsByUserId(req.user.id);
  }
}
