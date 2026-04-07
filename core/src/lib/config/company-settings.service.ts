import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';

export interface ICompanySettings {
  defaultCurrency: string;
  fiscalYearStart: number;
  taxIncludedInPrice: boolean;
  salesOrderPrefix: string;
  purchaseOrderPrefix: string;
  invoicePrefix: string;
  receiptPrefix: string;
  billPrefix: string;
}

@Injectable()
export class CompanySettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings(companyId: string): Promise<ICompanySettings> {
    let settings = await this.prisma.companySettings.findUnique({ where: { companyId } });
    if (!settings) {
      settings = await this.prisma.companySettings.create({
        data: { id: randomUUID(), companyId },
      });
    }
    return settings;
  }

  async updateSettings(companyId: string, data: Partial<ICompanySettings>): Promise<ICompanySettings> {
    return this.prisma.companySettings.upsert({
      where: { companyId },
      update: data,
      create: { id: randomUUID(), companyId, ...data },
    });
  }
}