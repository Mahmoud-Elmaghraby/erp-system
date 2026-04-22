import { Module } from "@nestjs/common";
import { CompaniesModule } from "./companies/companies.module";
import { OutboxModule } from "./infrastructure/outbox/outbox.module";
import { RedisModule } from "./infrastructure/redis/redis.module";
import { AuthModule } from "./modules/auth/auth.module";
import { BranchesModule } from "./modules/branches/branches.module";
import { CurrencyModule } from "./modules/currency/currency.module";
import { RbacModule } from "./modules/rbac/rbac.module";
import { SettingsModule } from "./modules/settings/settings.module";
import { UsersModule } from "./modules/users/users.module";


@Module({
  imports: [
    RedisModule,
    AuthModule,
    CompaniesModule,
    BranchesModule,
    RbacModule,
    UsersModule,
    OutboxModule,
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
    CurrencyModule,
    SettingsModule,
  ],
})
export class CoreModule {}