export interface ReceiptItem {
  id: string;
  productId: string;
  receivedQty: number;
}

export class PurchaseReceiptEntity {
  constructor(
    public readonly id: string,
    public readonly receiptNumber: string,
    public readonly orderId: string,
    public readonly warehouseId: string,
    public readonly notes: string | null,
    public readonly items: ReceiptItem[],
    public readonly createdAt: Date,
  ) {}

  static create(data: {
    id: string;
    receiptNumber: string;
    orderId: string;
    warehouseId: string;
    notes?: string;
    items: Array<{ id: string; productId: string; receivedQty: number }>;
  }): PurchaseReceiptEntity {
    return new PurchaseReceiptEntity(
      data.id, data.receiptNumber, data.orderId,
      data.warehouseId, data.notes ?? null,
      data.items, new Date(),
    );
  }
}