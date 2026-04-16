import type { SupplierEntity } from '../entities/supplier.entity';

export interface ISupplierRepository {
  findAll(companyId: string): Promise<SupplierEntity[]>;
  findById(id: string): Promise<SupplierEntity | null>;
  create(supplier: SupplierEntity): Promise<SupplierEntity>;
  update(id: string, data: Partial<SupplierEntity>): Promise<SupplierEntity>;
  delete(id: string): Promise<void>;
}

export const SUPPLIER_REPOSITORY = 'SUPPLIER_REPOSITORY';