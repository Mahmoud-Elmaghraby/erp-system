import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IPurchaseReceiptRepository } from '../../../domain/repositories/purchase-receipt.repository.interface';
import { PURCHASE_RECEIPT_REPOSITORY } from '../../../domain/repositories/purchase-receipt.repository.interface';
import type { IPurchaseOrderRepository } from '../../../domain/repositories/purchase-order.repository.interface';
import { PURCHASE_ORDER_REPOSITORY } from '../../../domain/repositories/purchase-order.repository.interface';
import { PurchaseReceiptEntity } from '../../../domain/entities/purchase-receipt.entity';
import { PurchaseReceivedEvent } from '../../../domain/events/purchase-received.event';
import { CreatePurchaseReceiptDto } from '../../dtos/purchase-receipt.dto';
import { OutboxService, PrismaService } from '@org/core';
import { DocumentSequenceService } from '@org/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomUUID } from 'crypto';

@Injectable()
export class CreatePurchaseReceiptUseCase {
  constructor(
    @Inject(PURCHASE_RECEIPT_REPOSITORY)
    private receiptRepository: IPurchaseReceiptRepository,
    @Inject(PURCHASE_ORDER_REPOSITORY)
    private orderRepository: IPurchaseOrderRepository,
    private documentSequenceService: DocumentSequenceService,
    private outboxService: OutboxService,
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: CreatePurchaseReceiptDto): Promise<PurchaseReceiptEntity> {
    const order = await this.orderRepository.findById(dto.orderId);
    if (!order) throw new NotFoundException('Purchase order not found');
    if (order.status === 'CANCELLED') throw new Error('Cannot receive cancelled order');

    const receiptNumber = await this.documentSequenceService.getNextNumber(
      order.branchId, 'inventory', 'receipt', 'REC'
    );

    const receipt = PurchaseReceiptEntity.create({
      id: randomUUID(),
      receiptNumber,
      orderId: dto.orderId,
      warehouseId: dto.warehouseId,
      notes: dto.notes,
      items: dto.items.map(i => ({ id: randomUUID(), ...i })),
    });

    await this.prisma.$transaction(async (tx) => {
      await this.receiptRepository.create(receipt);

      for (const item of dto.items) {
        const orderItem = order.items.find(i => i.productId === item.productId);
        if (orderItem) {
          orderItem.receivedQty += item.receivedQty;
        }
      }

      order.updateReceiptStatus();
      await this.orderRepository.update(order.id, { status: order.status });

      await this.outboxService.publish(
        'purchase.received',
        {
          purchaseId: receipt.id,
          warehouseId: dto.warehouseId,
          items: dto.items.map(i => {
            const orderItem = order.items.find(oi => oi.productId === i.productId);
            return {
              productId: i.productId,
              quantity: i.receivedQty,
              unitCost: orderItem?.unitCost ?? 0,
            };
          }),
        },
        tx,
      );
    });

    this.eventEmitter.emit('purchase.received', new PurchaseReceivedEvent(
      receipt.id,
      dto.warehouseId,
      dto.items.map(i => {
        const orderItem = order.items.find(oi => oi.productId === i.productId);
        return { productId: i.productId, quantity: i.receivedQty, unitCost: orderItem?.unitCost ?? 0 };
      }),
    ));

    return receipt;
  }
}