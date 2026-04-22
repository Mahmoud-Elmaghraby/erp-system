import { Module, Global } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RbacModule } from '../rbac/rbac.module'; // ✅ أضف

// Company
import { CompanySettingsService } from './company/company-settings.service';
import { CompanySettingsController } from './company/company-settings.controller';
// Sales
import { SalesSettingsService } from './sales/sales-settings.service';
// Purchasing
import { PurchasingSettingsService } from './purchasing/purchasing-settings.service';
// Accounting
import { AccountingSettingsService } from './accounting/accounting-settings.service';
// Document Sequence
import { DocumentSequenceService } from './document-sequence/document-sequence.service';
import { DocumentSequenceController } from './document-sequence/document-sequence.controller';
// Dynamic Registry
import { SettingsRegistry } from './dynamic/settings.registry';
import { SettingsService } from './dynamic/settings.service';
import { SettingsController } from './dynamic/settings.controller';
import { LogisticsSettingsService } from './logistics/logistics-settings.service';

@Global()
@Module({
  imports: [
    RbacModule, // ✅ أضف
  ],
  controllers: [
    CompanySettingsController,
    SettingsController,
    DocumentSequenceController,
  ],
  providers: [
    PrismaService,
    CompanySettingsService,
    SalesSettingsService,
    PurchasingSettingsService,
    AccountingSettingsService,
    DocumentSequenceService,
    SettingsRegistry,
    SettingsService,
        LogisticsSettingsService, // ✅ أضف

  ],
  exports: [
    CompanySettingsService,
    SalesSettingsService,
    PurchasingSettingsService,
    AccountingSettingsService,
    DocumentSequenceService,
    SettingsRegistry,
    SettingsService,
    LogisticsSettingsService
  ],
})
export class SettingsModule {}