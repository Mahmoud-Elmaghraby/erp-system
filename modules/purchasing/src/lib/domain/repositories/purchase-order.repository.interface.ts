import type { PurchaseOrderEntity } from '../entities/purchase-order.entity';

export const PURCHASE_ORDER_REPOSITORY = 'PURCHASE_ORDER_REPOSITORY';

export interface IPurchaseOrderRepository {
  findAll(branchId?: string): Promise<any[]>;
  findById(id: string): Promise<PurchaseOrderEntity | null>;
  create(order: PurchaseOrderEntity): Promise<PurchaseOrderEntity>;
  update(id: string, data: Partial<PurchaseOrderEntity>): Promise<PurchaseOrderEntity>;
}