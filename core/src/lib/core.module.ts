import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { BranchesModule } from './branches/branches.module';
import { RbacModule } from './rbac/rbac.module';
import { UsersModule } from './users/users.module';
import { RedisModule } from './redis/redis.module';
import { OutboxModule } from './outbox/outbox.module';
import { ConfigModule } from './config/config.module';
import { CurrencyModule } from './currency/currency.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    RedisModule,
    AuthModule,
    CompaniesModule,
    BranchesModule,
    RbacModule,
    UsersModule,
    OutboxModule,
    ConfigModule,
    CurrencyModule,
    SettingsModule,
  ],
  exports: [
    RedisModule,
    AuthModule,
    CompaniesModule,
    BranchesModule,
    RbacModule,
    UsersModule,
    OutboxModule,
    ConfigModule,
    CurrencyModule,
    SettingsModule,
  ],
})
export class OrgCoreModule {}