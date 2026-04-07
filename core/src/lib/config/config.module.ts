import { Module, Global } from '@nestjs/common';
import { CompanySettingsService } from './company-settings.service';
import { DocumentSequenceService } from './document-sequence.service';
import { SalesSettingsService } from './sales-settings.service';
import { PurchasingSettingsService } from './purchasing-settings.service';
import { AccountingSettingsService } from './accounting-settings.service';
import { PrismaService } from '../prisma.service';

@Global()
@Module({
  providers: [
    PrismaService,
    CompanySettingsService,
    DocumentSequenceService,
    SalesSettingsService,
    PurchasingSettingsService,
    AccountingSettingsService,
  ],
  exports: [
    CompanySettingsService,
    DocumentSequenceService,
    SalesSettingsService,
    PurchasingSettingsService,
    AccountingSettingsService,
  ],
})
export class ConfigModule {}