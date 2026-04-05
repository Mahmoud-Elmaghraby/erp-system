import { Module } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { PermissionGuard } from './permission.guard';
import { PrismaService } from '../prisma.service';
import { PermissionsCacheService } from '../redis/permissions-cache.service';

@Module({
  providers: [RbacService, PermissionGuard, PrismaService, PermissionsCacheService],
  exports: [RbacService, PermissionGuard],
})
export class RbacModule {}