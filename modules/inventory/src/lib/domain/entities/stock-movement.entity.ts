export type MovementType = 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';

export class StockMovementEntity {
  constructor(
    public readonly id: string,
    public readonly type: MovementType,
    public readonly quantity: number,
    public readonly warehouseId: string,
    public readonly productId: string,
    public readonly companyId: string,
    public readonly reason: string | null,
    public readonly reference: string | null,
    public readonly fromWarehouseId: string | null,
    public readonly toWarehouseId: string | null,
    public readonly userId: string | null,
    public readonly createdAt: Date,
  ) {}

  static create(data: {
    id: string;
    type: MovementType;
    quantity: number;
    warehouseId: string;
    productId: string;
    companyId: string;
    reason?: string;
    reference?: string;
    fromWarehouseId?: string;
    toWarehouseId?: string;
    userId?: string;
  }): StockMovementEntity {
    return new StockMovementEntity(
      data.id,
      data.type,
      data.quantity,
      data.warehouseId,
      data.productId,
      data.companyId,
      data.reason ?? null,
      data.reference ?? null,
      data.fromWarehouseId ?? null,
      data.toWarehouseId ?? null,
      data.userId ?? null,
      new Date(),
    );
  }
}