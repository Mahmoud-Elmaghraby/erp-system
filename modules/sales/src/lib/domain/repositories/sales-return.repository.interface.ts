import type { SalesReturnEntity } from '../entities/sales-return.entity';

export interface ISalesReturnRepository {
  findAll(orderId: string): Promise<SalesReturnEntity[]>;
  findByBranch(branchId: string): Promise<SalesReturnEntity[]>; // ✅ جديد
  findById(id: string): Promise<SalesReturnEntity | null>;
  create(salesReturn: SalesReturnEntity): Promise<SalesReturnEntity>;
  update(id: string, data: Partial<SalesReturnEntity>): Promise<SalesReturnEntity>;
}

export const SALES_RETURN_REPOSITORY = 'SALES_RETURN_REPOSITORY';