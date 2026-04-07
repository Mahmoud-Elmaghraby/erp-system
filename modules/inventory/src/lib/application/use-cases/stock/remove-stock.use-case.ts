import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IStockRepository } from '../../../domain/repositories/stock.repository.interface';
import { STOCK_REPOSITORY } from '../../../domain/repositories/stock.repository.interface';
import type { IStockMovementRepository } from '../../../domain/repositories/stock-movement.repository.interface';
import { STOCK_MOVEMENT_REPOSITORY } from '../../../domain/repositories/stock-movement.repository.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StockUpdatedEvent } from '../../../domain/events/stock-updated.event';
import { StockLowEvent } from '../../../domain/events/stock-low.event';
import { StockMovementEntity } from '../../../domain/entities/stock-movement.entity';
import { Quantity } from '../../../domain/value-objects/quantity.vo';
import { RemoveStockDto } from '../../dtos/stock.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class RemoveStockUseCase {
  constructor(
    @Inject(STOCK_REPOSITORY)
    private stockRepository: IStockRepository,
    @Inject(STOCK_MOVEMENT_REPOSITORY)
    private stockMovementRepository: IStockMovementRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: RemoveStockDto) {
    const stock = await this.stockRepository.findByWarehouseAndProduct(dto.warehouseId, dto.productId);
    if (!stock) throw new NotFoundException('Stock not found');

    stock.removeQuantity(Quantity.create(dto.quantity));
    const updated = await this.stockRepository.update(stock.id, stock.quantity.getValue());

    await this.stockMovementRepository.create(
      StockMovementEntity.create({
        id: randomUUID(),
        type: 'OUT',
        quantity: dto.quantity,
        warehouseId: dto.warehouseId,
        productId: dto.productId,
        reason: dto.reason,
      }),
    );

    this.eventEmitter.emit('stock.updated', new StockUpdatedEvent(
      dto.warehouseId, dto.productId, dto.quantity, 'OUT'
    ));

    if (updated.isBelowMinStock()) {
      this.eventEmitter.emit('stock.low', new StockLowEvent(
        dto.warehouseId, dto.productId,
        updated.quantity.getValue(), updated.minStock.getValue(),
      ));
    }

    return updated;
  }
}