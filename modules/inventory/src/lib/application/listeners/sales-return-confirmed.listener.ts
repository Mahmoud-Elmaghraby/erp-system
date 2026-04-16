import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Inject } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { IStockRepository } from '../../domain/repositories/stock.repository.interface';
import { STOCK_REPOSITORY } from '../../domain/repositories/stock.repository.interface';
import type { IStockMovementRepository } from '../../domain/repositories/stock-movement.repository.interface';
import { STOCK_MOVEMENT_REPOSITORY } from '../../domain/repositories/stock-movement.repository.interface';
import { StockMovementEntity } from '../../domain/entities/stock-movement.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class SalesReturnConfirmedListener {
  private readonly logger = new Logger(SalesReturnConfirmedListener.name);

  constructor(
    @Inject(STOCK_REPOSITORY)
    private stockRepository: IStockRepository,
    @Inject(STOCK_MOVEMENT_REPOSITORY)
    private stockMovementRepository: IStockMovementRepository,
    private prisma: PrismaService,
  ) {}

  @OnEvent('sales.return.confirmed')
  async handleSalesReturnConfirmed(payload: {
    returnId: string;
    orderId: string;
    companyId: string;
    items: Array<{ productId: string; quantity: number }>;
  }) {
    this.logger.log(`Processing sales return confirmed: ${payload.returnId}`);

    const order = await this.prisma.salesOrder.findUnique({
      where: { id: payload.orderId },
    });

    if (!order) {
      this.logger.warn(`Order not found: ${payload.orderId}`);
      return;
    }

    const warehouses = await this.prisma.warehouse.findMany({
      where: { companyId: payload.companyId, isActive: true },
    });

    const warehouseId = warehouses[0]?.id;
    if (!warehouseId) {
      this.logger.warn(`No warehouse found for company: ${payload.companyId}`);
      return;
    }

    for (const item of payload.items) {
      try {
        await this.stockRepository.upsert(warehouseId, item.productId, item.quantity);

        await this.stockMovementRepository.create(
          StockMovementEntity.create({
            id: randomUUID(),
            type: 'IN',
            quantity: item.quantity,
            warehouseId,
            productId: item.productId,
            companyId: payload.companyId,
            reason: 'مرتجع مبيعات',
            reference: payload.returnId,
          }),
        );
      } catch (error) {
        this.logger.error(`Failed to return stock for product ${item.productId}`, error);
      }
    }
  }
}