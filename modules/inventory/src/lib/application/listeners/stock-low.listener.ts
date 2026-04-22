import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { StockLowEvent } from '../../domain/events/stock-low.event';
import { PrismaService } from '@org/core';
import { randomUUID } from 'crypto';

@Injectable()
export class StockLowListener {
  private readonly logger = new Logger(StockLowListener.name);

  constructor(private prisma: PrismaService) {}

  @OnEvent('stock.low')
  async handleStockLow(event: StockLowEvent) {
    this.logger.warn(
      `Low stock alert: Product ${event.productId} in warehouse ${event.warehouseId}. Current: ${event.currentQuantity}, Min: ${event.minStock}`
    );

    await this.prisma.outboxEvent.create({
      data: {
        id: randomUUID(),
        eventType: 'stock.low.notification',
        payload: {
          productId: event.productId,
          warehouseId: event.warehouseId,
          currentQuantity: event.currentQuantity,
          minStock: event.minStock,
        },
        status: 'PENDING', // ✅ الـ Prisma هيتعامل معاه صح مع الـ Enum
      },
    });
  }
}