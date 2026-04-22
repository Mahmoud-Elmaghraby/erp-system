export type PurchaseOrderStatus = 'DRAFT' | 'CONFIRMED' | 'PARTIALLY_RECEIVED' | 'FULLY_RECEIVED' | 'CANCELLED';

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitCost: number;
  total: number;
  receivedQty: number;
}

export class PurchaseOrderEntity {
  constructor(
    public readonly id: string,
    public orderNumber: string,
    public status: PurchaseOrderStatus,
    public readonly supplierId: string,
    public readonly warehouseId: string,
    public readonly branchId: string,
    public notes: string | null,
    public totalAmount: number,
    public currency: string,
    public exchangeRate: number,
    public expectedDate: Date | null,
    public items: PurchaseOrderItem[],
  ) {}

  static create(data: {
    id: string;
    orderNumber: string;
    supplierId: string;
    warehouseId: string;
    branchId: string;
    notes?: string;
    currency?: string;
    exchangeRate?: number;
    expectedDate?: Date;
    items: Array<{ id: string; productId: string; quantity: number; unitCost: number }>;
  }): PurchaseOrderEntity {
    const items = data.items.map(i => ({
      ...i,
      total: i.quantity * i.unitCost,
      receivedQty: 0,
    }));
    const totalAmount = items.reduce((sum, i) => sum + i.total, 0);

    return new PurchaseOrderEntity(
      data.id, data.orderNumber, 'DRAFT',
      data.supplierId, data.warehouseId, data.branchId,
      data.notes ?? null, totalAmount,
      data.currency ?? 'EGP', data.exchangeRate ?? 1,
      data.expectedDate ?? null, items,
    );
  }

  confirm(): void {
    if (this.status !== 'DRAFT') throw new Error('Only DRAFT orders can be confirmed');
    this.status = 'CONFIRMED';
  }

  cancel(): void {
    if (this.status === 'FULLY_RECEIVED') throw new Error('Cannot cancel fully received orders');
    this.status = 'CANCELLED';
  }

  updateReceiptStatus(): void {
    const totalQty = this.items.reduce((sum, i) => sum + i.quantity, 0);
    const totalReceived = this.items.reduce((sum, i) => sum + i.receivedQty, 0);
    if (totalReceived >= totalQty) {
      this.status = 'FULLY_RECEIVED';
    } else if (totalReceived > 0) {
      this.status = 'PARTIALLY_RECEIVED';
    }
  }
}