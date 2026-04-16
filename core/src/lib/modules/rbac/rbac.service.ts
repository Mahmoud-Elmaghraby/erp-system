import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { PermissionsCacheService } from '../../infrastructure/redis/permissions-cache.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { CreatePermissionDto } from './dtos/create-permission.dto';

@Injectable()
export class RbacService {
  constructor(
    private prisma: PrismaService,
    private permissionsCache: PermissionsCacheService,
  ) {}

  // ============ ROLES ============

  async findAllRoles(companyId: string) {
  return this.prisma.role.findMany({
    where: { isActive: true, companyId },  // ✅
    include: {
      rolePermissions: {
        include: { permission: true },
      },
      _count: { select: { userRoles: true } },
    },
  });
}
  async findOneRole(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: { include: { permission: true } },
        _count: { select: { userRoles: true } },
      },
    });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

 async createRole(dto: CreateRoleDto, companyId: string) {
  const exists = await this.prisma.role.findFirst({
    where: { name: dto.name, companyId },  // ✅ unique per company
  });
  if (exists) throw new ConflictException('Role name already exists');
  return this.prisma.role.create({ 
    data: { ...dto, companyId }  // ✅
  });
}
  async deactivateRole(id: string) {
    await this.findOneRole(id);
    return this.prisma.role.update({
      where: { id },
      data: { isActive: false },
      select: { id: true, name: true, isActive: true },
    });
  }

  // ============ PERMISSIONS ============

  async findAllPermissions() {
    return this.prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { name: 'asc' }],
    });
  }

  async findPermissionsByModule(module: string) {
    return this.prisma.permission.findMany({
      where: { module },
      orderBy: { name: 'asc' },
    });
  }

  async createPermission(dto: CreatePermissionDto) {
    const exists = await this.prisma.permission.findUnique({
      where: { name: dto.name },
    });
    if (exists) throw new ConflictException('Permission already exists');
    return this.prisma.permission.create({ data: dto });
  }

  // ============ ROLE <-> PERMISSION ============

  async assignPermissionToRole(roleId: string, permissionId: string) {
    await this.findOneRole(roleId);

    const permission = await this.prisma.permission.findUnique({
      where: { id: permissionId },
    });
    if (!permission) throw new NotFoundException('Permission not found');

    const exists = await this.prisma.rolePermission.findUnique({
      where: { roleId_permissionId: { roleId, permissionId } },
    });
    if (exists) throw new ConflictException('Permission already assigned to role');

    return this.prisma.rolePermission.create({ data: { roleId, permissionId } });
  }

  async removePermissionFromRole(roleId: string, permissionId: string) {
    const exists = await this.prisma.rolePermission.findUnique({
      where: { roleId_permissionId: { roleId, permissionId } },
    });
    if (!exists) throw new NotFoundException('Permission not assigned to this role');

    // Clear cache for all users with this role
    const userRoles = await this.prisma.userRole.findMany({
      where: { roleId },
    });
    await Promise.all(
      userRoles.map((ur) => this.permissionsCache.clearPermissions(ur.userId)),
    );

    return this.prisma.rolePermission.delete({
      where: { roleId_permissionId: { roleId, permissionId } },
    });
  }

  // ============ USER <-> ROLE ============

  async assignRoleToUser(userId: string, roleId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    await this.findOneRole(roleId);

    const exists = await this.prisma.userRole.findUnique({
      where: { userId_roleId: { userId, roleId } },
    });
    if (exists) throw new ConflictException('Role already assigned to user');

    const result = await this.prisma.userRole.create({
      data: { userId, roleId },
    });

    // Clear permissions cache
    await this.permissionsCache.clearPermissions(userId);
    return result;
  }

  async removeRoleFromUser(userId: string, roleId: string) {
    const exists = await this.prisma.userRole.findUnique({
      where: { userId_roleId: { userId, roleId } },
    });
    if (!exists) throw new NotFoundException('Role not assigned to this user');

    await this.prisma.userRole.delete({
      where: { userId_roleId: { userId, roleId } },
    });

    await this.permissionsCache.clearPermissions(userId);
    return { message: 'Role removed from user successfully' };
  }

  async getUserRoles(userId: string) {
    return this.prisma.userRole.findMany({
      where: { userId },
      include: { role: { include: { rolePermissions: { include: { permission: true } } } } },
    });
  }

  // ============ PERMISSIONS CHECK ============

  async getUserPermissions(userId: string): Promise<string[]> {
    const cached = await this.permissionsCache.getPermissions(userId);
    if (cached) return cached;

    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            rolePermissions: { include: { permission: true } },
          },
        },
      },
    });

    const permissions = userRoles.flatMap((ur) =>
      ur.role.rolePermissions.map((rp) => rp.permission.name),
    );

    const unique = [...new Set(permissions)];
    await this.permissionsCache.setPermissions(userId, unique);
    return unique;
  }

  async hasPermission(userId: string, permission: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return permissions.includes(permission);
  }
}