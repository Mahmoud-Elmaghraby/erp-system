import { Module, OnModuleInit } from '@nestjs/common';
import { PrismaService, RbacModule, SettingsRegistry } from '@org/core';
import { accountingSettingsDefinition } from './accounting.settings';

import { TaxesController } from './presentation/controllers/taxes.controller';
import { PaymentTermsController } from './presentation/controllers/payment-terms.controller';
import { ChartOfAccountsController } from './presentation/controllers/chart-of-accounts.controller';

import { TaxRepository } from './infrastructure/repositories/tax.repository';
import { PaymentTermRepository } from './infrastructure/repositories/payment-term.repository';
import { ChartOfAccountRepository } from './infrastructure/repositories/chart-of-account.repository';

import { TAX_REPOSITORY } from './domain/repositories/tax.repository.interface';
import { PAYMENT_TERM_REPOSITORY } from './domain/repositories/payment-term.repository.interface';
import { CHART_OF_ACCOUNT_REPOSITORY } from './domain/repositories/chart-of-account.repository.interface';

@Module({
  imports: [RbacModule],
  controllers: [
    TaxesController,
    PaymentTermsController,
    ChartOfAccountsController,
  ],
  providers: [
    PrismaService,
    { provide: TAX_REPOSITORY, useClass: TaxRepository },
    { provide: PAYMENT_TERM_REPOSITORY, useClass: PaymentTermRepository },
    { provide: CHART_OF_ACCOUNT_REPOSITORY, useClass: ChartOfAccountRepository },
  ],
  exports: [TAX_REPOSITORY, PAYMENT_TERM_REPOSITORY, CHART_OF_ACCOUNT_REPOSITORY],
})
export class AccountingModule implements OnModuleInit {
  constructor(private settingsRegistry: SettingsRegistry) {}

  onModuleInit() {
    this.settingsRegistry.register(accountingSettingsDefinition);
  }
}