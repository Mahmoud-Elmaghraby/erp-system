import { WarehouseEntity } from '../entities/warehouse.entity';

export interface IWarehouseRepository {
  findAll(companyId: string): Promise<WarehouseEntity[]>;
  findById(id: string): Promise<WarehouseEntity | null>;
  create(warehouse: WarehouseEntity): Promise<WarehouseEntity>;
  update(id: string, data: Partial<WarehouseEntity>): Promise<WarehouseEntity>;
  delete(id: string): Promise<void>;
}

export const WAREHOUSE_REPOSITORY = 'WAREHOUSE_REPOSITORY';