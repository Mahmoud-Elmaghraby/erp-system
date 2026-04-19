import { Module, OnModuleInit } from '@nestjs/common';
import { AccountingSettingsService, PrismaService, RbacModule, SettingsRegistry } from '@org/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { accountingSettingsDefinition } from './accounting.settings';

import { TaxesController } from './presentation/controllers/taxes.controller';
import { PaymentTermsController } from './presentation/controllers/payment-terms.controller';
import { ChartOfAccountsController } from './presentation/controllers/chart-of-accounts.controller';
import { JournalsController } from './presentation/controllers/journals.controller';
import { JournalEntriesController } from './presentation/controllers/journal-entries.controller';
import { FiscalYearController } from './presentation/controllers/fiscal-year.controller';

import { TaxRepository } from './infrastructure/repositories/tax.repository';
import { PaymentTermRepository } from './infrastructure/repositories/payment-term.repository';
import { ChartOfAccountRepository } from './infrastructure/repositories/chart-of-account.repository';
import { JournalRepository } from './infrastructure/repositories/journal.repository';
import { JournalEntryRepository } from './infrastructure/repositories/journal-entry.repository';
import { FiscalYearRepository } from './infrastructure/repositories/fiscal-year.repository';

import { AccountingService } from './application/services/accounting.service';
import { FiscalYearService } from './application/services/fiscal-year.service';

import { InvoiceCreatedListener } from './application/listeners/invoice-created.listener';
import { InvoicePaidListener } from './application/listeners/invoice-paid.listener';

import { CreateChartOfAccountUseCase } from './application/use-cases/chart-of-accounts/create-chart-of-account.use-case';
import { UpdateChartOfAccountUseCase } from './application/use-cases/chart-of-accounts/update-chart-of-account.use-case';
import { GetAccountsTreeUseCase } from './application/use-cases/chart-of-accounts/get-accounts-tree.use-case';
import { MoveAccountUseCase } from './application/use-cases/chart-of-accounts/move-account.use-case';
import { DeleteAccountUseCase } from './application/use-cases/chart-of-accounts/delete-account.use-case';

import { TAX_REPOSITORY } from './domain/repositories/tax.repository.interface';
import { PAYMENT_TERM_REPOSITORY } from './domain/repositories/payment-term.repository.interface';
import { CHART_OF_ACCOUNT_REPOSITORY } from './domain/repositories/chart-of-account.repository.interface';
import { JOURNAL_REPOSITORY } from './domain/repositories/journal.repository.interface';
import { JOURNAL_ENTRY_REPOSITORY } from './domain/repositories/journal-entry.repository.interface';
import { FISCAL_YEAR_REPOSITORY } from './domain/repositories/fiscal-year.repository.interface';

@Module({
  imports: [
    RbacModule,
    EventEmitterModule.forRoot(),
  ],

  controllers: [
    TaxesController,
    PaymentTermsController,
    ChartOfAccountsController,
    JournalsController,
    JournalEntriesController,
    FiscalYearController,
  ],

  providers: [
    PrismaService,
    AccountingSettingsService,

    AccountingService,
    FiscalYearService,

    InvoiceCreatedListener,
    InvoicePaidListener,

    // Chart Of Accounts Use Cases
    CreateChartOfAccountUseCase,
    UpdateChartOfAccountUseCase,
    GetAccountsTreeUseCase,
    MoveAccountUseCase,
    DeleteAccountUseCase,

    // Repositories
    { provide: TAX_REPOSITORY, useClass: TaxRepository },
    { provide: PAYMENT_TERM_REPOSITORY, useClass: PaymentTermRepository },
    { provide: CHART_OF_ACCOUNT_REPOSITORY, useClass: ChartOfAccountRepository },
    { provide: JOURNAL_REPOSITORY, useClass: JournalRepository },
    { provide: JOURNAL_ENTRY_REPOSITORY, useClass: JournalEntryRepository },
    { provide: FISCAL_YEAR_REPOSITORY, useClass: FiscalYearRepository },
  ],

  exports: [
    AccountingSettingsService,
    AccountingService,
    FiscalYearService,

    TAX_REPOSITORY,
    PAYMENT_TERM_REPOSITORY,
    CHART_OF_ACCOUNT_REPOSITORY,
    JOURNAL_REPOSITORY,
    JOURNAL_ENTRY_REPOSITORY,
    FISCAL_YEAR_REPOSITORY,
  ],
})
export class AccountingModule implements OnModuleInit {

  constructor(private settingsRegistry: SettingsRegistry) {}

  onModuleInit() {
    this.settingsRegistry.register(accountingSettingsDefinition);
  }

}