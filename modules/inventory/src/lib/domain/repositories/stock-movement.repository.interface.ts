import { StockMovementEntity } from '../entities/stock-movement.entity';

export interface IStockMovementRepository {
  findByWarehouse(warehouseId: string): Promise<any[]>;
  findByProduct(productId: string): Promise<any[]>;
  findAll(filters?: {
    companyId: string;
    warehouseId?: string;
    productId?: string;
    type?: string;
  }): Promise<any[]>;
  create(movement: StockMovementEntity): Promise<StockMovementEntity>;
}

export const STOCK_MOVEMENT_REPOSITORY = 'STOCK_MOVEMENT_REPOSITORY';