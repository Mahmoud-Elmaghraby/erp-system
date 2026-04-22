import { StockEntity } from '../entities/stock.entity';

export interface IStockRepository {
  findByWarehouse(warehouseId: string): Promise<StockEntity[]>;
  findByWarehouseAndProduct(warehouseId: string, productId: string): Promise<StockEntity | null>;
  upsert(warehouseId: string, productId: string, quantity: number): Promise<StockEntity>;
  update(id: string, quantity: number): Promise<StockEntity>;
}

export const STOCK_REPOSITORY = 'STOCK_REPOSITORY';