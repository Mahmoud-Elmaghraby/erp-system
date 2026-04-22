import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class TokenBlacklistService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async blacklist(token: string, ttl: number): Promise<void> {
    await this.cache.set(`blacklist:${token}`, true, ttl);
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const result = await this.cache.get(`blacklist:${token}`);
    return !!result;
  }
}