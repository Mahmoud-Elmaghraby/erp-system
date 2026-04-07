import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { IPurchaseOrderRepository } from '../../domain/repositories/purchase-order.repository.interface';
import { PurchaseOrderEntity } from '../../domain/entities/purchase-order.entity';

@Injectable()
export class PurchaseOrderRepository implements IPurchaseOrderRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(branchId?: string): Promise<any[]> {
    return this.prisma.purchaseOrder.findMany({
      where: branchId ? { branchId } : {},
      include: {
        supplier: { select: { id: true, name: true } },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<PurchaseOrderEntity | null> {
    const order = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: { items: true },
    });
    return order ? this.toEntity(order) : null;
  }

  async create(entity: PurchaseOrderEntity): Promise<PurchaseOrderEntity> {
    const order = await this.prisma.purchaseOrder.create({
      data: {
        id: entity.id,
        orderNumber: entity.orderNumber,
        status: entity.status,
        supplierId: entity.supplierId,
        warehouseId: entity.warehouseId,
        branchId: entity.branchId,
        notes: entity.notes,
        totalAmount: entity.totalAmount,
        currency: entity.currency,
        exchangeRate: entity.exchangeRate,
        expectedDate: entity.expectedDate,
        items: {
          create: entity.items.map(i => ({
            id: i.id, productId: i.productId,
            quantity: i.quantity, unitCost: i.unitCost, total: i.total,
          })),
        },
      },
      include: { items: true },
    });
    return this.toEntity(order);
  }

  async update(id: string, data: Partial<PurchaseOrderEntity>): Promise<PurchaseOrderEntity> {
    const order = await this.prisma.purchaseOrder.update({
      where: { id },
      data: { status: data.status },
      include: { items: true },
    });
    return this.toEntity(order);
  }

  private toEntity(o: any): PurchaseOrderEntity {
    const order = new PurchaseOrderEntity(
      o.id, o.orderNumber, o.status, o.supplierId,
      o.warehouseId, o.branchId, o.notes,
      Number(o.totalAmount), o.currency, Number(o.exchangeRate),
      o.expectedDate, [],
    );
    order.items = (o.items || []).map((i: any) => ({
      id: i.id, productId: i.productId,
      quantity: Number(i.quantity), unitCost: Number(i.unitCost),
      total: Number(i.total), receivedQty: Number(i.receivedQty),
    }));
    return order;
  }
}