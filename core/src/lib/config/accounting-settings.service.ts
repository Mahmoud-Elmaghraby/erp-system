import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';

export interface IAccountingSettings {
  method: string;
  taxMethod: string;
  multiCurrency: boolean;
  lockDate?: Date | null;
  defaultSalesAccount?: string | null;
  defaultCOGSAccount?: string | null;
  defaultExpenseAccount?: string | null;
}

@Injectable()
export class AccountingSettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings(companyId: string): Promise<IAccountingSettings> {
    let settings = await this.prisma.accountingSettings.findUnique({ where: { companyId } });
    if (!settings) {
      settings = await this.prisma.accountingSettings.create({
        data: { id: randomUUID(), companyId },
      });
    }
    return settings;
  }

  async updateSettings(companyId: string, data: Partial<IAccountingSettings>): Promise<IAccountingSettings> {
    return this.prisma.accountingSettings.upsert({
      where: { companyId },
      update: data,
      create: { id: randomUUID(), companyId, ...data },
    });
  }

  async isLocked(companyId: string, date: Date): Promise<boolean> {
    const settings = await this.getSettings(companyId);
    if (!settings.lockDate) return false;
    return date <= settings.lockDate;
  }
}