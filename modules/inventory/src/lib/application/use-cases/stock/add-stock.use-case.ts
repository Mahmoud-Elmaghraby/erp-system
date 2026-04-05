import { Inject, Injectable } from '@nestjs/common';
import type { IStockRepository } from '../../../domain/repositories/stock.repository.interface';
import { STOCK_REPOSITORY } from '../../../domain/repositories/stock.repository.interface';import { EventEmitter2 } from '@nestjs/event-emitter';
import { StockUpdatedEvent } from '../../../domain/events/stock-updated.event';
import { StockLowEvent } from '../../../domain/events/stock-low.event';
import { AddStockDto } from '../../dtos/stock.dto';

@Injectable()
export class AddStockUseCase {
  constructor(
    @Inject(STOCK_REPOSITORY)
    private stockRepository: IStockRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: AddStockDto) {
    const stock = await this.stockRepository.upsert(dto.warehouseId, dto.productId, dto.quantity);

    this.eventEmitter.emit('stock.updated', new StockUpdatedEvent(
      dto.warehouseId, dto.productId, dto.quantity, 'IN'
    ));

    if (stock.isBelowMinStock()) {
      this.eventEmitter.emit('stock.low', new StockLowEvent(
        dto.warehouseId,
        dto.productId,
        stock.quantity.getValue(),
        stock.minStock.getValue(),
      ));
    }

    return stock;
  }
}