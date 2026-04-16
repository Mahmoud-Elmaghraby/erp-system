import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RbacService } from './rbac.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionGuard } from './permission.guard';
import { RequirePermission } from './require-permission.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateRoleDto } from './dtos/create-role.dto';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { AssignPermissionDto, AssignRoleDto } from './dtos/assign-permission.dto';

@ApiTags('RBAC')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('rbac')
export class RbacController {
  constructor(private rbacService: RbacService) {}

  // ============ ROLES ============

  @Get('roles')
  @RequirePermission('settings.roles.view')
  @ApiOperation({ summary: 'Get all roles' })
  findAllRoles(@CurrentUser('companyId') companyId: string) {
    return this.rbacService.findAllRoles(companyId);
  }

  @Get('roles/:id')
  @RequirePermission('settings.roles.view')
  @ApiOperation({ summary: 'Get role by id' })
  findOneRole(@Param('id', ParseUUIDPipe) id: string) {
    return this.rbacService.findOneRole(id);
  }

  @Post('roles')
  @RequirePermission('settings.roles.create')
  @ApiOperation({ summary: 'Create new role' })
  createRole(
    @Body() dto: CreateRoleDto,
    @CurrentUser('companyId') companyId: string,
  ) {
    return this.rbacService.createRole(dto, companyId);
  }

  @Delete('roles/:id')
  @RequirePermission('settings.roles.edit')
  @ApiOperation({ summary: 'Deactivate role' })
  deactivateRole(@Param('id', ParseUUIDPipe) id: string) {
    return this.rbacService.deactivateRole(id);
  }

  // ============ PERMISSIONS ============

  @Get('permissions')
  @RequirePermission('settings.roles.view')
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiQuery({ name: 'module', required: false })
  findAllPermissions(@Query('module') module?: string) {
    if (module) return this.rbacService.findPermissionsByModule(module);
    return this.rbacService.findAllPermissions();
  }

  @Post('permissions')
  @RequirePermission('settings.roles.create')
  @ApiOperation({ summary: 'Create new permission' })
  createPermission(@Body() dto: CreatePermissionDto) {
    return this.rbacService.createPermission(dto);
  }

  // ============ ROLE <-> PERMISSION ============

  @Post('roles/:roleId/permissions')
  @RequirePermission('settings.roles.edit')
  @ApiOperation({ summary: 'Assign permission to role' })
  assignPermission(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Body() dto: AssignPermissionDto,
  ) {
    return this.rbacService.assignPermissionToRole(roleId, dto.permissionId);
  }

  @Delete('roles/:roleId/permissions/:permissionId')
  @RequirePermission('settings.roles.edit')
  @ApiOperation({ summary: 'Remove permission from role' })
  removePermission(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Param('permissionId', ParseUUIDPipe) permissionId: string,
  ) {
    return this.rbacService.removePermissionFromRole(roleId, permissionId);
  }

  // ============ USER <-> ROLE ============

  @Get('users/:userId/roles')
  @RequirePermission('settings.users.view')
  @ApiOperation({ summary: 'Get user roles' })
  getUserRoles(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.rbacService.getUserRoles(userId);
  }

  @Post('users/:userId/roles')
  @RequirePermission('settings.users.edit')
  @ApiOperation({ summary: 'Assign role to user' })
  assignRole(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: AssignRoleDto,
  ) {
    return this.rbacService.assignRoleToUser(userId, dto.roleId);
  }

  @Delete('users/:userId/roles/:roleId')
  @RequirePermission('settings.users.edit')
  @ApiOperation({ summary: 'Remove role from user' })
  removeRole(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('roleId', ParseUUIDPipe) roleId: string,
  ) {
    return this.rbacService.removeRoleFromUser(userId, roleId);
  }

  // ============ MY PERMISSIONS ============

  @Get('me/permissions')
  @ApiOperation({ summary: 'Get my permissions' })
  getMyPermissions(@CurrentUser('id') userId: string) {
    return this.rbacService.getUserPermissions(userId);
  }
}