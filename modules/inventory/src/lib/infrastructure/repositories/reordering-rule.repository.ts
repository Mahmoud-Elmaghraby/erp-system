import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { IReorderingRuleRepository } from '../../domain/repositories/reordering-rule.repository.interface';
import { ReorderingRuleEntity } from '../../domain/entities/reordering-rule.entity';

@Injectable()
export class ReorderingRuleRepository implements IReorderingRuleRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, warehouseId?: string): Promise<ReorderingRuleEntity[]> {
    const rules = await this.prisma.reorderingRule.findMany({
      where: {
        warehouse: { companyId },
        ...(warehouseId && { warehouseId }),
        isActive: true,
      },
      include: {
        product: { select: { id: true, name: true, barcode: true } },
        warehouse: { select: { id: true, name: true } },
      },
    });
    return rules.map(this.toEntity);
  }

  async findByProductAndWarehouse(productId: string, warehouseId: string): Promise<ReorderingRuleEntity | null> {
    const rule = await this.prisma.reorderingRule.findUnique({
      where: { productId_warehouseId: { productId, warehouseId } },
    });
    return rule ? this.toEntity(rule) : null;
  }

  async upsert(entity: ReorderingRuleEntity): Promise<ReorderingRuleEntity> {
    const rule = await this.prisma.reorderingRule.upsert({
      where: { productId_warehouseId: { productId: entity.productId, warehouseId: entity.warehouseId } },
      update: {
        minQuantity: entity.minQuantity,
        maxQuantity: entity.maxQuantity,
        reorderQuantity: entity.reorderQuantity,
        isActive: entity.isActive,
      },
      create: {
        id: entity.id,
        productId: entity.productId,
        warehouseId: entity.warehouseId,
        minQuantity: entity.minQuantity,
        maxQuantity: entity.maxQuantity,
        reorderQuantity: entity.reorderQuantity,
        isActive: entity.isActive,
      },
    });
    return this.toEntity(rule);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.reorderingRule.update({ where: { id }, data: { isActive: false } });
  }

  private toEntity(r: any): ReorderingRuleEntity {
    return new ReorderingRuleEntity(
      r.id, r.productId, r.warehouseId,
      Number(r.minQuantity), Number(r.maxQuantity),
      Number(r.reorderQuantity), r.isActive,
    );
  }
}