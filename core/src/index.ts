
// ================= CORE =================
export * from './lib/core.module';

// ================= INFRASTRUCTURE =================
export * from './lib/infrastructure/prisma/prisma.service';

// Redis
export * from './lib/infrastructure/redis/redis.module';
export * from './lib/infrastructure/redis/token-blacklist.service';
export * from './lib/infrastructure/redis/permissions-cache.service';

// Outbox
export * from './lib/infrastructure/outbox/outbox.module';
export * from './lib/infrastructure/outbox/outbox.service';

// ================= MODULES =================

// Auth
export * from './lib/modules/auth/auth.module';
export * from './lib/modules/auth/auth.service';
export * from './lib/modules/auth/auth.controller';
export * from './lib/modules/auth/jwt-auth.guard';
export * from './lib/modules/auth/decorators/current-user.decorator';
export * from './lib/modules/auth/dtos/login.dto';

// Companies
export * from './lib/modules/companies/companies.module';
export * from './lib/modules/companies/companies.service';
export * from './lib/modules/companies/companies.controller';
export * from './lib/modules/companies/dtos/create-company.dto';
export * from './lib/modules/companies/dtos/update-company.dto';

// Branches
export * from './lib/modules/branches/branches.module';
export * from './lib/modules/branches/branches.service';
export * from './lib/modules/branches/branches.controller';
export * from './lib/modules/branches/dtos/create-branch.dto';
export * from './lib/modules/branches/dtos/update-branch.dto';

// Users
export * from './lib/modules/users/users.module';
export * from './lib/modules/users/users.service';
export * from './lib/modules/users/users.controller';
export * from './lib/modules/users/dtos/create-user.dto';
export * from './lib/modules/users/dtos/update-user.dto';
export * from './lib/modules/users/dtos/update-profile.dto';

// RBAC
export * from './lib/modules/rbac/rbac.module';
export * from './lib/modules/rbac/rbac.service';
export * from './lib/modules/rbac/rbac.controller';
export * from './lib/modules/rbac/permission.guard';
export * from './lib/modules/rbac/require-permission.decorator';
export * from './lib/modules/rbac/dtos/create-role.dto';
export * from './lib/modules/rbac/dtos/create-permission.dto';
export * from './lib/modules/rbac/dtos/assign-permission.dto';

// Currency
export * from './lib/modules/currency/currency.module';
export * from './lib/modules/currency/currency.service';
export * from './lib/modules/currency/currency.controller';
export * from './lib/modules/currency/dto/create-currency.dto';

// Settings
export * from './lib/modules/settings/settings.module';

// Company Settings
export * from './lib/modules/settings/company/company-settings.service';
export * from './lib/modules/settings/company/company-settings.controller';
export * from './lib/modules/settings/company/dto/update-company-settings.dto';

// Sales Settings
export * from './lib/modules/settings/sales/sales-settings.service';

// Purchasing Settings
export * from './lib/modules/settings/purchasing/purchasing-settings.service';

// Accounting Settings
export * from './lib/modules/settings/accounting/accounting-settings.service';

// Logistics Settings
export * from './lib/modules/settings/logistics/logistics-settings.service';

// Document Sequence
export * from './lib/modules/settings/document-sequence/document-sequence.service';
export * from './lib/modules/settings/document-sequence/document-sequence.controller';

// Dynamic Settings
export * from './lib/modules/settings/dynamic/settings.interface';
export * from './lib/modules/settings/dynamic/settings.registry';
export * from './lib/modules/settings/dynamic/settings.service';
export * from './lib/modules/settings/dynamic/settings.controller';

// ================= SHARED =================

// Common
export * from './lib/shared/common/dto/pagination.dto';
export * from './lib/shared/common/interfaces/paginated-result.interface';
export * from './lib/shared/common/helpers/paginate.helper';

// Filters
export * from './lib/shared/filters/global-exception.filter';

// Interceptors
export * from './lib/shared/interceptors/transform.interceptor';

