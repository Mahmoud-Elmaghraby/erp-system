import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class PermissionsCacheService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async getPermissions(userId: string): Promise<string[] | null> {
    const result = await this.cache.get<string[]>(`permissions:${userId}`);
    return result ?? null;
  }

  async setPermissions(userId: string, permissions: string[]): Promise<void> {
    await this.cache.set(`permissions:${userId}`, permissions, 60 * 5);
  }

  async clearPermissions(userId: string): Promise<void> {
    await this.cache.del(`permissions:${userId}`);
  }
}