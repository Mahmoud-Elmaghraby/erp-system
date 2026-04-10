import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';

export interface IPurchasingSettings {
  taxEnabled: boolean;             // ✅ موجود في الـ Schema
  rfqEnabled: boolean;             // ✅ موجود في الـ Schema
  purchaseReturnsEnabled: boolean; // ✅ الاسم الصح
  landedCostsEnabled: boolean;     // ✅ موجود في الـ Schema
  requireApproval: boolean;
  approvalThreshold: number;
  threeWayMatching: boolean;
  defaultPaymentTerms: number;
  defaultWarehouseId?: string | null;
}
@Injectable()
export class PurchasingSettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings(companyId: string): Promise<IPurchasingSettings> {
    let settings = await this.prisma.purchasingSettings.findUnique({ where: { companyId } });
    if (!settings) {
      settings = await this.prisma.purchasingSettings.create({
        data: { id: randomUUID(), companyId },
      });
    }
    return {
      ...settings,
      approvalThreshold: Number(settings.approvalThreshold),
    };
  }

  async updateSettings(companyId: string, data: Partial<IPurchasingSettings>): Promise<IPurchasingSettings> {
    const settings = await this.prisma.purchasingSettings.upsert({
      where: { companyId },
      update: data,
      create: { id: randomUUID(), companyId, ...data },
    });
    return {
      ...settings,
      approvalThreshold: Number(settings.approvalThreshold),
    };
  }

  async requiresApproval(companyId: string, amount: number): Promise<boolean> {
    const settings = await this.getSettings(companyId);
    if (!settings.requireApproval) return false;
    return amount >= settings.approvalThreshold;
  }
}