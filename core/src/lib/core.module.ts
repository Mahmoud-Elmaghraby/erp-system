import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { BranchesModule } from './branches/branches.module';
import { RbacModule } from './rbac/rbac.module';
import { UsersModule } from './users/users.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [RedisModule, AuthModule, CompaniesModule, BranchesModule, RbacModule, UsersModule],
  exports: [RedisModule, AuthModule, CompaniesModule, BranchesModule, RbacModule, UsersModule],
})
export class OrgCoreModule {}