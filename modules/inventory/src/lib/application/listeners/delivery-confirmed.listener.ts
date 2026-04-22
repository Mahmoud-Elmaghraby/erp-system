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
export class DeliveryConfirmedListener {
  private readonly logger = new Logger(DeliveryConfirmedListener.name);

  constructor(
    @Inject(STOCK_REPOSITORY)
    private stockRepository: IStockRepository,
    @Inject(STOCK_MOVEMENT_REPOSITORY)
    private stockMovementRepository: IStockMovementRepository,
  ) {}

  @OnEvent('delivery.confirmed')
  async handleDeliveryConfirmed(payload: {
    deliveryId: string;
    orderId: string;
    warehouseId: string;
    companyId: string;
    items: Array<{ productId: string; quantity: number }>;
  }) {
    this.logger.log(`Processing delivery confirmed: ${payload.deliveryId}`);

    for (const item of payload.items) {
      try {
        const stocks = await this.stockRepository.findByWarehouse(payload.warehouseId);
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
            warehouseId: payload.warehouseId,
            productId: item.productId,
            companyId: payload.companyId,
            reason: 'تسليم مبيعات',
            reference: payload.deliveryId,
          }),
        );
      } catch (error) {
        this.logger.error(`Failed to reduce stock for product ${item.productId}`, error);
      }
    }
  }
}