import type { PurchaseReceiptEntity } from '../entities/purchase-receipt.entity';

export interface IPurchaseReceiptRepository {
  findByOrder(orderId: string): Promise<any[]>;
  create(receipt: PurchaseReceiptEntity): Promise<PurchaseReceiptEntity>;
}

export const PURCHASE_RECEIPT_REPOSITORY = 'PURCHASE_RECEIPT_REPOSITORY';