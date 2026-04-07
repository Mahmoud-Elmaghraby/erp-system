import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { IInventorySettingsRepository } from '../../domain/repositories/inventory-settings.repository.interface';
import { InventorySettingsEntity } from '../../domain/entities/inventory-settings.entity';

@Injectable()
export class InventorySettingsRepository implements IInventorySettingsRepository {
  constructor(private prisma: PrismaService) {}

  async findByCompany(companyId: string): Promise<InventorySettingsEntity | null> {
    const settings = await this.prisma.inventorySettings.findUnique({ where: { companyId } });
    return settings ? this.toEntity(settings) : null;
  }

  async upsert(entity: InventorySettingsEntity): Promise<InventorySettingsEntity> {
    const settings = await this.prisma.inventorySettings.upsert({
      where: { companyId: entity.companyId },
      update: {
        valuationMethod: entity.valuationMethod,
        trackLotNumbers: entity.trackLotNumbers,
        trackSerialNumbers: entity.trackSerialNumbers,
        trackExpiryDates: entity.trackExpiryDates,
        requireTransferApproval: entity.requireTransferApproval,
        requireAdjustmentApproval: entity.requireAdjustmentApproval,
        enableLowStockAlert: entity.enableLowStockAlert,
        defaultMinStock: entity.defaultMinStock,
        allowNegativeStock: entity.allowNegativeStock,
      },
      create: {
        id: entity.id,
        companyId: entity.companyId,
        valuationMethod: entity.valuationMethod,
        trackLotNumbers: entity.trackLotNumbers,
        trackSerialNumbers: entity.trackSerialNumbers,
        trackExpiryDates: entity.trackExpiryDates,
        requireTransferApproval: entity.requireTransferApproval,
        requireAdjustmentApproval: entity.requireAdjustmentApproval,
        enableLowStockAlert: entity.enableLowStockAlert,
        defaultMinStock: entity.defaultMinStock,
        allowNegativeStock: entity.allowNegativeStock,
      },
    });
    return this.toEntity(settings);
  }

  private toEntity(s: any): InventorySettingsEntity {
    return new InventorySettingsEntity(
      s.id, s.companyId, s.valuationMethod,
      s.trackLotNumbers, s.trackSerialNumbers, s.trackExpiryDates,
      s.requireTransferApproval, s.requireAdjustmentApproval,
      s.enableLowStockAlert, Number(s.defaultMinStock), s.allowNegativeStock,
    );
  }
}