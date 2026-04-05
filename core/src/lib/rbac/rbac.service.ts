import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PermissionsCacheService } from '../redis/permissions-cache.service';

@Injectable()
export class RbacService {
  constructor(
    private prisma: PrismaService,
    private permissionsCache: PermissionsCacheService,
  ) {}

  async createRole(data: { name: string; description?: string }) {
    return this.prisma.role.create({ data });
  }

  async createPermission(data: { name: string; module: string; description?: string }) {
    return this.prisma.permission.create({ data });
  }

  async assignPermissionToRole(roleId: string, permissionId: string) {
    const result = await this.prisma.rolePermission.create({ data: { roleId, permissionId } });
    return result;
  }

  async assignRoleToUser(userId: string, roleId: string) {
    const result = await this.prisma.userRole.create({ data: { userId, roleId } });
    await this.permissionsCache.clearPermissions(userId);
    return result;
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const cached = await this.permissionsCache.getPermissions(userId);
    if (cached) return cached;

    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    const permissions = userRoles.flatMap((ur) =>
      ur.role.rolePermissions.map((rp) => rp.permission.name)
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