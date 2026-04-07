import type { StockAdjustmentEntity } from '../entities/stock-adjustment.entity';

export interface IStockAdjustmentRepository {
  findAll(warehouseId?: string): Promise<any[]>;
  findById(id: string): Promise<StockAdjustmentEntity | null>;
  create(adjustment: StockAdjustmentEntity): Promise<StockAdjustmentEntity>;
  update(id: string, data: Partial<StockAdjustmentEntity>): Promise<StockAdjustmentEntity>;
}

export const STOCK_ADJUSTMENT_REPOSITORY = 'STOCK_ADJUSTMENT_REPOSITORY';