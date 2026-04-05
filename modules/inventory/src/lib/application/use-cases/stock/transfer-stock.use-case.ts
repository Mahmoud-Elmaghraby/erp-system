import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IStockRepository } from '../../../domain/repositories/stock.repository.interface';
import { STOCK_REPOSITORY } from '../../../domain/repositories/stock.repository.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StockUpdatedEvent } from '../../../domain/events/stock-updated.event';
import { Quantity } from '../../../domain/value-objects/quantity.vo';
import { TransferStockDto } from '../../dtos/stock.dto';

@Injectable()
export class TransferStockUseCase {
  constructor(
    @Inject(STOCK_REPOSITORY)
    private stockRepository: IStockRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: TransferStockDto) {
    const fromStock = await this.stockRepository.findByWarehouseAndProduct(
      dto.fromWarehouseId, dto.productId
    );
    if (!fromStock) throw new NotFoundException('Stock not found in source warehouse');

    fromStock.removeQuantity(Quantity.create(dto.quantity));
    await this.stockRepository.update(fromStock.id, fromStock.quantity.getValue());
    await this.stockRepository.upsert(dto.toWarehouseId, dto.productId, dto.quantity);

    this.eventEmitter.emit('stock.updated', new StockUpdatedEvent(
      dto.fromWarehouseId, dto.productId, dto.quantity, 'TRANSFER'
    ));

    return { success: true };
  }
}