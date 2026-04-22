import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { IStockAdjustmentRepository } from '../../domain/repositories/stock-adjustment.repository.interface';
import { StockAdjustmentEntity } from '../../domain/entities/stock-adjustment.entity';

@Injectable()
export class StockAdjustmentRepository implements IStockAdjustmentRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, warehouseId?: string): Promise<any[]> {
    return this.prisma.stockAdjustment.findMany({
      where: {
        warehouse: { companyId },
        ...(warehouseId && { warehouseId }),
      },
      include: {
        warehouse: { select: { id: true, name: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, barcode: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<StockAdjustmentEntity | null> {
    const adj = await this.prisma.stockAdjustment.findUnique({
      where: { id },
      include: { items: true },
    });
    return adj ? this.toEntity(adj) : null;
  }

  async create(entity: StockAdjustmentEntity): Promise<StockAdjustmentEntity> {
    const adj = await this.prisma.stockAdjustment.create({
      data: {
        id: entity.id,
        warehouseId: entity.warehouseId,
        reason: entity.reason,
        notes: entity.notes,
        status: entity.status,
        userId: entity.userId,
        items: {
          create: entity.items.map(item => ({
            id: item.id,
            productId: item.productId,
            expectedQuantity: item.expectedQuantity,
            actualQuantity: item.actualQuantity,
            difference: item.difference,
          })),
        },
      },
      include: { items: true },
    });
    return this.toEntity(adj);
  }

  async update(id: string, data: Partial<StockAdjustmentEntity>): Promise<StockAdjustmentEntity> {
    const adj = await this.prisma.stockAdjustment.update({
      where: { id },
      data: { status: data.status as any },
      include: { items: true },
    });
    return this.toEntity(adj);
  }

  private toEntity(adj: any): StockAdjustmentEntity {
    return new StockAdjustmentEntity(
      adj.id, adj.warehouseId, adj.status, adj.reason,
      adj.notes, adj.userId,
      (adj.items || []).map((i: any) => ({
        id: i.id, productId: i.productId,
        expectedQuantity: Number(i.expectedQuantity),
        actualQuantity: Number(i.actualQuantity),
        difference: Number(i.difference),
      })),
      adj.createdAt,
    );
  }
}