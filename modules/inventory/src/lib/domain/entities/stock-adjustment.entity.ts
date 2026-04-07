export type AdjustmentStatus = 'DRAFT' | 'CONFIRMED';

export interface AdjustmentItem {
  id: string;
  productId: string;
  expectedQuantity: number;
  actualQuantity: number;
  difference: number;
}

export class StockAdjustmentEntity {
  constructor(
    public readonly id: string,
    public readonly warehouseId: string,
    public status: AdjustmentStatus,
    public readonly reason: string,
    public readonly notes: string | null,
    public readonly userId: string | null,
    public items: AdjustmentItem[],
    public readonly createdAt: Date,
  ) {}

  static create(data: {
    id: string;
    warehouseId: string;
    reason: string;
    notes?: string;
    userId?: string;
    items: Array<{ id: string; productId: string; expectedQuantity: number; actualQuantity: number }>;
  }): StockAdjustmentEntity {
    const items = data.items.map(item => ({
      ...item,
      difference: item.actualQuantity - item.expectedQuantity,
    }));
    return new StockAdjustmentEntity(
      data.id, data.warehouseId, 'DRAFT',
      data.reason, data.notes ?? null, data.userId ?? null,
      items, new Date(),
    );
  }

  confirm(): void {
    if (this.status !== 'DRAFT') throw new Error('Only DRAFT adjustments can be confirmed');
    this.status = 'CONFIRMED';
  }
}