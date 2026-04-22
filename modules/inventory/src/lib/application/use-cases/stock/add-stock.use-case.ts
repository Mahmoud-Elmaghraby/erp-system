import { Inject, Injectable } from '@nestjs/common';
import type { IStockRepository } from '../../../domain/repositories/stock.repository.interface';
import { STOCK_REPOSITORY } from '../../../domain/repositories/stock.repository.interface';
import type { IStockMovementRepository } from '../../../domain/repositories/stock-movement.repository.interface';
import { STOCK_MOVEMENT_REPOSITORY } from '../../../domain/repositories/stock-movement.repository.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StockUpdatedEvent } from '../../../domain/events/stock-updated.event';
import { StockLowEvent } from '../../../domain/events/stock-low.event';
import { StockMovementEntity } from '../../../domain/entities/stock-movement.entity';
import { AddStockDto } from '../../dtos/stock.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class AddStockUseCase {
  constructor(
    @Inject(STOCK_REPOSITORY)
    private stockRepository: IStockRepository,
    @Inject(STOCK_MOVEMENT_REPOSITORY)
    private stockMovementRepository: IStockMovementRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: AddStockDto, companyId: string) {
    const stock = await this.stockRepository.upsert(dto.warehouseId, dto.productId, dto.quantity);

    await this.stockMovementRepository.create(
      StockMovementEntity.create({
        id: randomUUID(),
        type: 'IN',
        quantity: dto.quantity,
        warehouseId: dto.warehouseId,
        productId: dto.productId,
        companyId,
        reason: dto.reason,
      }),
    );

    this.eventEmitter.emit('stock.updated', new StockUpdatedEvent(
      dto.warehouseId, dto.productId, dto.quantity, 'IN'
    ));

    if (stock.isBelowMinStock()) {
      this.eventEmitter.emit('stock.low', new StockLowEvent(
        dto.warehouseId, dto.productId,
        stock.quantity.getValue(), stock.minStock.getValue(),
      ));
    }

    return stock;
  }
}