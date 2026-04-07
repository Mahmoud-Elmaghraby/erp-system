import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { IPurchaseReceiptRepository } from '../../domain/repositories/purchase-receipt.repository.interface';
import { PurchaseReceiptEntity } from '../../domain/entities/purchase-receipt.entity';

@Injectable()
export class PurchaseReceiptRepository implements IPurchaseReceiptRepository {
  constructor(private prisma: PrismaService) {}

  async findByOrder(orderId: string): Promise<any[]> {
    return this.prisma.purchaseReceipt.findMany({
      where: { orderId },
      include: {
        items: {
          include: { receipt: false },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(entity: PurchaseReceiptEntity): Promise<PurchaseReceiptEntity> {
    const receipt = await this.prisma.purchaseReceipt.create({
      data: {
        id: entity.id,
        receiptNumber: entity.receiptNumber,
        orderId: entity.orderId,
        warehouseId: entity.warehouseId,
        notes: entity.notes,
        items: {
          create: entity.items.map(i => ({
            id: i.id,
            productId: i.productId,
            receivedQty: i.receivedQty,
          })),
        },
      },
      include: { items: true },
    });
    return new PurchaseReceiptEntity(
      receipt.id, receipt.receiptNumber, receipt.orderId,
      receipt.warehouseId, receipt.notes,
      receipt.items.map(i => ({ id: i.id, productId: i.productId, receivedQty: Number(i.receivedQty) })),
      receipt.createdAt,
    );
  }
}