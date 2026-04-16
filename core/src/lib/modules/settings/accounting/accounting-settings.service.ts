import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { randomUUID } from 'crypto';

export interface IAccountingSettings {
  method: string;
  taxMethod: string;
  multiCurrency: boolean;
  journalEntriesEnabled: boolean;

  // Lock Dates — مستويين
  softLockDate: Date | null;
  hardLockDate: Date | null;

  // Default Accounts
  defaultSalesAccount:   string | null;
  defaultCOGSAccount:    string | null;
  defaultExpenseAccount: string | null;
  defaultARAccount:      string | null;
  defaultAPAccount:      string | null;
  defaultCashAccount:    string | null;  // ✅ جديد
  defaultBankAccount:    string | null;  // ✅ جديد

  // Default Journals
  defaultSaleJournalId:     string | null;  // ✅ جديد
  defaultPurchaseJournalId: string | null;  // ✅ جديد
  defaultCashJournalId:     string | null;  // ✅ جديد
  defaultBankJournalId:     string | null;  // ✅ جديد
}

@Injectable()
export class AccountingSettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings(companyId: string): Promise<IAccountingSettings> {
    let settings = await this.prisma.accountingSettings.findUnique({
      where: { companyId },
    });
    if (!settings) {
      settings = await this.prisma.accountingSettings.create({
        data: { id: randomUUID(), companyId },
      });
    }
    return settings as IAccountingSettings;
  }

  async updateSettings(
    companyId: string,
    data: Partial<IAccountingSettings>,
  ): Promise<IAccountingSettings> {
    return this.prisma.accountingSettings.upsert({
      where: { companyId },
      update: data,
      create: { id: randomUUID(), companyId, ...data },
    }) as Promise<IAccountingSettings>;
  }

  async isLocked(companyId: string, date: Date): Promise<boolean> {
    const s = await this.getSettings(companyId);
    // ✅ بيتحقق من الـ hardLockDate أولاً، بعدين الـ softLockDate
    if (s.hardLockDate && date <= s.hardLockDate) return true;
    if (s.softLockDate && date <= s.softLockDate) return true;
    return false;
  }
}