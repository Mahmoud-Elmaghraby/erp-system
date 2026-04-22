import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Inject } from '@nestjs/common';
import type { IStockRepository } from '../../domain/repositories/stock.repository.interface';
import { STOCK_REPOSITORY } from '../../domain/repositories/stock.repository.interface';
import type { IStockMovementRepository } from '../../domain/repositories/stock-movement.repository.interface';
import { STOCK_MOVEMENT_REPOSITORY } from '../../domain/repositories/stock-movement.repository.interface';
import { StockMovementEntity } from '../../domain/entities/stock-movement.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class PurchaseReceivedListener {
  private readonly logger = new Logger(PurchaseReceivedListener.name);

  constructor(
    @Inject(STOCK_REPOSITORY)
    private stockRepository: IStockRepository,
    @Inject(STOCK_MOVEMENT_REPOSITORY)
    private stockMovementRepository: IStockMovementRepository,
  ) {}

  @OnEvent('purchase.received')
  async handlePurchaseReceived(payload: {
    purchaseId: string;
    warehouseId: string;
    companyId: string;
    items: Array<{ productId: string; quantity: number; unitCost: number }>;
  }) {
    this.logger.log(`Processing purchase received: ${payload.purchaseId}`);

    for (const item of payload.items) {
      try {
        await this.stockRepository.upsert(
          payload.warehouseId,
          item.productId,
          item.quantity,
        );

        await this.stockMovementRepository.create(
          StockMovementEntity.create({
            id: randomUUID(),
            type: 'IN',
            quantity: item.quantity,
            warehouseId: payload.warehouseId,
            productId: item.productId,
            companyId: payload.companyId,
            reason: 'مشتريات',
            reference: payload.purchaseId,
          }),
        );
      } catch (error) {
        this.logger.error(`Failed to add stock for product ${item.productId}`, error);
      }
    }
  }
}