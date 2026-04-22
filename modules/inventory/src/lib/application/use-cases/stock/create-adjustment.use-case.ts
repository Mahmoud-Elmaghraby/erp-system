import { Inject, Injectable } from '@nestjs/common';
import type { IStockAdjustmentRepository } from '../../../domain/repositories/stock-adjustment.repository.interface';
import { STOCK_ADJUSTMENT_REPOSITORY } from '../../../domain/repositories/stock-adjustment.repository.interface';
import type { IStockRepository } from '../../../domain/repositories/stock.repository.interface';
import { STOCK_REPOSITORY } from '../../../domain/repositories/stock.repository.interface';
import { StockAdjustmentEntity } from '../../../domain/entities/stock-adjustment.entity';
import { CreateStockAdjustmentDto } from '../../dtos/stock-adjustment.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateStockAdjustmentUseCase {
  constructor(
    @Inject(STOCK_ADJUSTMENT_REPOSITORY)
    private adjustmentRepository: IStockAdjustmentRepository,
    @Inject(STOCK_REPOSITORY)
    private stockRepository: IStockRepository,
  ) {}

  async execute(dto: CreateStockAdjustmentDto): Promise<StockAdjustmentEntity> {
    const itemsWithExpected = await Promise.all(
      dto.items.map(async (item) => {
        const stock = await this.stockRepository.findByWarehouseAndProduct(
          dto.warehouseId, item.productId
        );
        return {
          id: randomUUID(),
          productId: item.productId,
          expectedQuantity: stock ? stock.quantity.getValue() : 0,
          actualQuantity: item.actualQuantity,
        };
      })
    );

    const adjustment = StockAdjustmentEntity.create({
      id: randomUUID(),
      warehouseId: dto.warehouseId,
      reason: dto.reason,
      notes: dto.notes,
      items: itemsWithExpected,
    });

    return this.adjustmentRepository.create(adjustment);
  }
}