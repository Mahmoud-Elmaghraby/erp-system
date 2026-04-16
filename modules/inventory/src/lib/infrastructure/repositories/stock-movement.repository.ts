import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { IStockMovementRepository } from '../../domain/repositories/stock-movement.repository.interface';
import { StockMovementEntity } from '../../domain/entities/stock-movement.entity';

@Injectable()
export class StockMovementRepository implements IStockMovementRepository {
  constructor(private prisma: PrismaService) {}

  async findByWarehouse(warehouseId: string): Promise<any[]> {
    return this.prisma.stockMovement.findMany({
      where: { warehouseId },
      include: {
        product: { select: { id: true, name: true, barcode: true } },
        warehouse: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByProduct(productId: string): Promise<any[]> {
    return this.prisma.stockMovement.findMany({
      where: { productId },
      include: {
        product: { select: { id: true, name: true } },
        warehouse: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(filters?: {
    companyId: string;
    warehouseId?: string;
    productId?: string;
    type?: string;
  }): Promise<any[]> {
    return this.prisma.stockMovement.findMany({
      where: {
        companyId: filters?.companyId,
        ...(filters?.warehouseId && { warehouseId: filters.warehouseId }),
        ...(filters?.productId && { productId: filters.productId }),
        ...(filters?.type && { type: filters.type as any }),
      },
      include: {
        product: { select: { id: true, name: true, barcode: true } },
        warehouse: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async create(entity: StockMovementEntity): Promise<StockMovementEntity> {
    const movement = await this.prisma.stockMovement.create({
      data: {
        id: entity.id,
        type: entity.type,
        quantity: entity.quantity,
        warehouseId: entity.warehouseId,
        productId: entity.productId,
        companyId: entity.companyId,
        reason: entity.reason,
        reference: entity.reference,
        fromWarehouseId: entity.fromWarehouseId,
        toWarehouseId: entity.toWarehouseId,
        userId: entity.userId,
      },
    });
    return new StockMovementEntity(
      movement.id, movement.type as any, Number(movement.quantity),
      movement.warehouseId, movement.productId, movement.companyId,
      movement.reason, movement.reference, movement.fromWarehouseId,
      movement.toWarehouseId, movement.userId, movement.createdAt,
    );
  }
}