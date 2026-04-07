import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';

export interface ISalesSettings {
  multiCurrency: boolean;
  allowDiscounts: boolean;
  maxDiscountPercent: number;
  requireDelivery: boolean;
  allowSalesReturns: boolean;
  requireApproval: boolean;
  approvalThreshold: number;
  defaultPaymentTerms: number;
  defaultWarehouseId?: string | null;
}

@Injectable()
export class SalesSettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings(companyId: string): Promise<ISalesSettings> {
    let settings = await this.prisma.salesSettings.findUnique({ where: { companyId } });
    if (!settings) {
      settings = await this.prisma.salesSettings.create({
        data: { id: randomUUID(), companyId },
      });
    }
    return {
      ...settings,
      maxDiscountPercent: Number(settings.maxDiscountPercent),
      approvalThreshold: Number(settings.approvalThreshold),
    };
  }

  async updateSettings(companyId: string, data: Partial<ISalesSettings>): Promise<ISalesSettings> {
    const settings = await this.prisma.salesSettings.upsert({
      where: { companyId },
      update: data,
      create: { id: randomUUID(), companyId, ...data },
    });
    return {
      ...settings,
      maxDiscountPercent: Number(settings.maxDiscountPercent),
      approvalThreshold: Number(settings.approvalThreshold),
    };
  }

  async canApplyDiscount(companyId: string, discount: number): Promise<boolean> {
    const settings = await this.getSettings(companyId);
    if (!settings.allowDiscounts) return false;
    if (discount > settings.maxDiscountPercent) return false;
    return true;
  }

  async requiresApproval(companyId: string, amount: number): Promise<boolean> {
    const settings = await this.getSettings(companyId);
    if (!settings.requireApproval) return false;
    return amount >= settings.approvalThreshold;
  }
}