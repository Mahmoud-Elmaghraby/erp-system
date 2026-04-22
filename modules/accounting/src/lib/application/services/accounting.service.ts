import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AccountingSettingsService } from '@org/core';
import { JOURNAL_REPOSITORY } from '../../domain/repositories/journal.repository.interface';
import { JOURNAL_ENTRY_REPOSITORY } from '../../domain/repositories/journal-entry.repository.interface';
import { CHART_OF_ACCOUNT_REPOSITORY } from '../../domain/repositories/chart-of-account.repository.interface';
import { FISCAL_YEAR_REPOSITORY } from '../../domain/repositories/fiscal-year.repository.interface';
import type { IJournalRepository } from '../../domain/repositories/journal.repository.interface';
import type { IJournalEntryRepository } from '../../domain/repositories/journal-entry.repository.interface';
import type { IChartOfAccountRepository } from '../../domain/repositories/chart-of-account.repository.interface';
import type { IFiscalYearRepository } from '../../domain/repositories/fiscal-year.repository.interface';
import { JournalEntryEntity } from '../../domain/entities/journal-entry.entity';
import { JournalItemEntity } from '../../domain/entities/journal-item.entity';

export interface SalesInvoiceEntryData {
  companyId: string;
  reference: string;
  date: Date;
  subtotal: number;
  taxAmount: number;
  total: number;
}

export interface PurchaseInvoiceEntryData {
  companyId: string;
  reference: string;
  date: Date;
  subtotal: number;
  taxAmount: number;
  total: number;
}

export interface PaymentEntryData {
  companyId: string;
  reference: string;
  date: Date;
  amount: number;
  type: 'SALES' | 'PURCHASE';
  method: 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'CARD';
}

@Injectable()
export class AccountingService {
  constructor(
    @Inject(JOURNAL_REPOSITORY)
    private journalRepository: IJournalRepository,
    @Inject(JOURNAL_ENTRY_REPOSITORY)
    private journalEntryRepository: IJournalEntryRepository,
    @Inject(CHART_OF_ACCOUNT_REPOSITORY)
    private accountRepository: IChartOfAccountRepository,
    @Inject(FISCAL_YEAR_REPOSITORY)
    private fiscalYearRepository: IFiscalYearRepository,
    // ✅ Typed settings — مش dynamic SettingsService
    private accountingSettingsService: AccountingSettingsService,
  ) {}

  // ── Helper — جيب الفترة المحاسبية وتحقق منها ─────────────────
  private async getFiscalPeriodId(companyId: string, date: Date): Promise<string> {
    const period = await this.fiscalYearRepository.findPeriodByDate(companyId, date);
    if (!period)
      throw new BadRequestException(
        `لا توجد سنة مالية مفتوحة تغطي تاريخ ${date.toISOString().split('T')[0]}`,
      );
    if (!period.canPostEntry())
      throw new BadRequestException(
        `الفترة المحاسبية "${period.name}" مقفولة`,
      );
    return period.id;
  }

  // ── Helper — جيب الحساب أو throw ─────────────────────────────
  private async getAccount(accountId: string | null | undefined, fallbackCode: string, companyId: string) {
    if (accountId) {
      const account = await this.accountRepository.findById(accountId);
      if (account) return account;
    }
    const account = await this.accountRepository.findByCode(fallbackCode, companyId);
    if (!account)
      throw new BadRequestException(`الحساب ${fallbackCode} غير موجود — راجع إعدادات المحاسبة`);
    return account;
  }

  // ─── فاتورة بيع ───────────────────────────────────────────────
  // مدين:  حسابات القبض (AR)
  // دائن:  المبيعات
  // دائن:  ضريبة القيمة المضافة المستحقة (لو في ضريبة)
  async createSalesInvoiceEntry(data: SalesInvoiceEntryData): Promise<void> {
    const settings = await this.accountingSettingsService.getSettings(data.companyId);
    if (!settings.journalEntriesEnabled) return;

    const journal = await this.journalRepository.findByType(data.companyId, 'SALE');
    if (!journal) return;

    const fiscalPeriodId = await this.getFiscalPeriodId(data.companyId, data.date);

    // ✅ من الـ settings أولاً، fallback للـ code
    const arAccount    = await this.getAccount(settings.defaultARAccount,    '113', data.companyId);
    const salesAccount = await this.getAccount(settings.defaultSalesAccount, '411', data.companyId);
    const vatAccount   = await this.getAccount(null,                         '212', data.companyId);

    const entryId = randomUUID();
    const items: JournalItemEntity[] = [
      JournalItemEntity.create({
        id: randomUUID(), entryId,
        name: `حسابات القبض — ${data.reference}`,
        debit: data.total, credit: 0,
        accountId: arAccount.id,
      }),
      JournalItemEntity.create({
        id: randomUUID(), entryId,
        name: `إيراد مبيعات — ${data.reference}`,
        debit: 0, credit: data.subtotal,
        accountId: salesAccount.id,
      }),
    ];

    if (data.taxAmount > 0) {
      items.push(JournalItemEntity.create({
        id: randomUUID(), entryId,
        name: `ضريبة القيمة المضافة — ${data.reference}`,
        debit: 0, credit: data.taxAmount,
        accountId: vatAccount.id,
      }));
    }

    const entry = new JournalEntryEntity(
      entryId, data.reference, data.date,
      'POSTED', data.companyId, journal.id, items,
      fiscalPeriodId, // ✅ ربط بالفترة المحاسبية
    );

    await this.journalEntryRepository.create(entry);
  }

  // ─── دفع مبيعات ───────────────────────────────────────────────
  // مدين:  الصندوق / البنك
  // دائن:  حسابات القبض (AR)
  async createSalesPaymentEntry(data: PaymentEntryData): Promise<void> {
    const settings = await this.accountingSettingsService.getSettings(data.companyId);
    if (!settings.journalEntriesEnabled) return;

    const journalType = data.method === 'CASH' ? 'CASH' : 'BANK';
    const journal = await this.journalRepository.findByType(data.companyId, journalType);
    if (!journal) return;

    const fiscalPeriodId = await this.getFiscalPeriodId(data.companyId, data.date);

    const cashAccount = data.method === 'CASH'
      ? await this.getAccount(settings.defaultCashAccount, '111', data.companyId)
      : await this.getAccount(settings.defaultBankAccount, '112', data.companyId);
    const arAccount = await this.getAccount(settings.defaultARAccount, '113', data.companyId);

    const entryId = randomUUID();
    const items: JournalItemEntity[] = [
      JournalItemEntity.create({
        id: randomUUID(), entryId,
        name: `تحصيل — ${data.reference}`,
        debit: data.amount, credit: 0,
        accountId: cashAccount.id,
      }),
      JournalItemEntity.create({
        id: randomUUID(), entryId,
        name: `تسوية حسابات القبض — ${data.reference}`,
        debit: 0, credit: data.amount,
        accountId: arAccount.id,
      }),
    ];

    const entry = new JournalEntryEntity(
      entryId, data.reference, data.date,
      'POSTED', data.companyId, journal.id, items,
      fiscalPeriodId,
    );

    await this.journalEntryRepository.create(entry);
  }

  // ─── فاتورة شراء ──────────────────────────────────────────────
  // مدين:  المخزون
  // مدين:  ضريبة المدخلات (VAT Receivable) لو في ضريبة
  // دائن:  حسابات الدفع (AP)
  async createPurchaseInvoiceEntry(data: PurchaseInvoiceEntryData): Promise<void> {
    const settings = await this.accountingSettingsService.getSettings(data.companyId);
    if (!settings.journalEntriesEnabled) return;

    const journal = await this.journalRepository.findByType(data.companyId, 'PURCHASE');
    if (!journal) return;

    const fiscalPeriodId = await this.getFiscalPeriodId(data.companyId, data.date);

    const inventoryAccount   = await this.getAccount(settings.defaultCOGSAccount, '114', data.companyId);
    const apAccount          = await this.getAccount(settings.defaultAPAccount,   '211', data.companyId);
    const vatInputAccount    = await this.getAccount(null,                         '115', data.companyId);

    const entryId = randomUUID();
    const items: JournalItemEntity[] = [
      JournalItemEntity.create({
        id: randomUUID(), entryId,
        name: `مشتريات مخزون — ${data.reference}`,
        debit: data.subtotal, credit: 0,
        accountId: inventoryAccount.id,
      }),
      JournalItemEntity.create({
        id: randomUUID(), entryId,
        name: `حسابات الدفع — ${data.reference}`,
        debit: 0, credit: data.total,
        accountId: apAccount.id,
      }),
    ];

    // ✅ ضريبة المدخلات — كانت ناقصة في الكود القديم
    if (data.taxAmount > 0) {
      items.push(JournalItemEntity.create({
        id: randomUUID(), entryId,
        name: `ضريبة مدخلات — ${data.reference}`,
        debit: data.taxAmount, credit: 0,
        accountId: vatInputAccount.id,
      }));
    }

    const entry = new JournalEntryEntity(
      entryId, data.reference, data.date,
      'POSTED', data.companyId, journal.id, items,
      fiscalPeriodId,
    );

    await this.journalEntryRepository.create(entry);
  }

  // ─── دفع مشتريات ──────────────────────────────────────────────
  // مدين:  حسابات الدفع (AP)
  // دائن:  الصندوق / البنك
  async createPurchasePaymentEntry(data: PaymentEntryData): Promise<void> {
    const settings = await this.accountingSettingsService.getSettings(data.companyId);
    if (!settings.journalEntriesEnabled) return;

    const journalType = data.method === 'CASH' ? 'CASH' : 'BANK';
    const journal = await this.journalRepository.findByType(data.companyId, journalType);
    if (!journal) return;

    const fiscalPeriodId = await this.getFiscalPeriodId(data.companyId, data.date);

    const apAccount = await this.getAccount(settings.defaultAPAccount, '211', data.companyId);
    const cashAccount = data.method === 'CASH'
      ? await this.getAccount(settings.defaultCashAccount, '111', data.companyId)
      : await this.getAccount(settings.defaultBankAccount, '112', data.companyId);

    const entryId = randomUUID();
    const items: JournalItemEntity[] = [
      JournalItemEntity.create({
        id: randomUUID(), entryId,
        name: `تسوية حسابات الدفع — ${data.reference}`,
        debit: data.amount, credit: 0,
        accountId: apAccount.id,
      }),
      JournalItemEntity.create({
        id: randomUUID(), entryId,
        name: `دفع مورد — ${data.reference}`,
        debit: 0, credit: data.amount,
        accountId: cashAccount.id,
      }),
    ];

    const entry = new JournalEntryEntity(
      entryId, data.reference, data.date,
      'POSTED', data.companyId, journal.id, items,
      fiscalPeriodId,
    );

    await this.journalEntryRepository.create(entry);
  }
}