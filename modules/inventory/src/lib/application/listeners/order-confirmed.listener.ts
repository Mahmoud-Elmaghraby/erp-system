import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Inject } from '@nestjs/common';
import type { IStockRepository } from '../../domain/repositories/stock.repository.interface';
import { STOCK_REPOSITORY } from '../../domain/repositories/stock.repository.interface';
import type { IStockMovementRepository } from '../../domain/repositories/stock-movement.repository.interface';
import { STOCK_MOVEMENT_REPOSITORY } from '../../domain/repositories/stock-movement.repository.interface';
import { StockMovementEntity } from '../../domain/entities/stock-movement.entity';
import { Quantity } from '../../domain/value-objects/quantity.vo';
import { randomUUID } from 'crypto';

@Injectable()
export class OrderConfirmedListener {
  private readonly logger = new Logger(OrderConfirmedListener.name);

  constructor(
    @Inject(STOCK_REPOSITORY)
    private stockRepository: IStockRepository,
    @Inject(STOCK_MOVEMENT_REPOSITORY)
    private stockMovementRepository: IStockMovementRepository,
  ) {}

  @OnEvent('order.confirmed')
  async handleOrderConfirmed(payload: {
    orderId: string;
    branchId: string;
    items: Array<{ productId: string; quantity: number }>;
  }) {
    this.logger.log(`Processing order confirmed: ${payload.orderId}`);

    for (const item of payload.items) {
      try {
        const stocks = await this.stockRepository.findByWarehouse(payload.branchId);
        const stock = stocks.find(s => s.productId === item.productId);

        if (!stock) {
          this.logger.warn(`No stock found for product ${item.productId}`);
          continue;
        }

        stock.removeQuantity(Quantity.create(item.quantity));
        await this.stockRepository.update(stock.id, stock.quantity.getValue());

        await this.stockMovementRepository.create(
          StockMovementEntity.create({
            id: randomUUID(),
            type: 'OUT',
            quantity: item.quantity,
            warehouseId: stock.warehouseId,
            productId: item.productId,
            reason: 'مبيعات',
            reference: payload.orderId,
          }),
        );

        this.logger.log(`Stock reduced for product ${item.productId} by ${item.quantity}`);
      } catch (error) {
        this.logger.error(`Failed to reduce stock for product ${item.productId}`, error);
      }
    }
  }
}