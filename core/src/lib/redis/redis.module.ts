import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { TokenBlacklistService } from './token-blacklist.service';
import { PermissionsCacheService } from './permissions-cache.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        stores: [createKeyv(process.env.REDIS_URL || 'redis://localhost:6379')],
        ttl: 60 * 5,
      }),
    }),
  ],
  providers: [TokenBlacklistService, PermissionsCacheService],
  exports: [CacheModule, TokenBlacklistService, PermissionsCacheService],
})
export class RedisModule {}