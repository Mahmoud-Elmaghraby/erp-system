import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { randomUUID } from 'crypto';

export interface ISalesSettings {
  taxEnabled: boolean;
  multiCurrency: boolean;
  allowDiscounts: boolean;
  maxDiscountPercent: number;
  quotationsEnabled: boolean;
  deliveryEnabled: boolean;
  salesReturnsEnabled: boolean;
  requireApproval: boolean;
  approvalThreshold: number;
  defaultPaymentTerms: number;
  defaultWarehouseId: string | null;
}

@Injectable()
export class SalesSettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings(companyId: string): Promise<ISalesSettings> {
    let settings = await this.prisma.salesSettings.findUnique({
      where: { companyId },
    });
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

  async updateSettings(
    companyId: string,
    data: Partial<ISalesSettings>,
  ): Promise<ISalesSettings> {
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
    const s = await this.getSettings(companyId);
    if (!s.allowDiscounts) return false;
    return discount <= s.maxDiscountPercent;
  }

  async requiresApproval(companyId: string, amount: number): Promise<boolean> {
    const s = await this.getSettings(companyId);
    if (!s.requireApproval) return false;
    return amount >= s.approvalThreshold;
  }
}