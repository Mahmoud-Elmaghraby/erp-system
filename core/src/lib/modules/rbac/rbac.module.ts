import { Module } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { RbacController } from './rbac.controller';
import { PermissionGuard } from './permission.guard';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { PermissionsCacheService } from '../../infrastructure/redis/permissions-cache.service';

@Module({
  controllers: [RbacController],
  providers: [RbacService, PermissionGuard, PrismaService, PermissionsCacheService],
  exports: [RbacService, PermissionGuard],
})
export class RbacModule {}