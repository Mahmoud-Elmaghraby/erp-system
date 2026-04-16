import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from './require-permission.decorator';
import { RbacService } from './rbac.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rbacService: RbacService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.get<string>(PERMISSION_KEY, context.getHandler());
    if (!permission) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new ForbiddenException('No user found');

    const hasPermission = await this.rbacService.hasPermission(user.id, permission);
    if (!hasPermission) throw new ForbiddenException('Insufficient permissions');

    return true;
  }
}