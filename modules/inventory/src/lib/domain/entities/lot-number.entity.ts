export class LotNumberEntity {
  constructor(
    public readonly id: string,
    public readonly lotNumber: string,
    public readonly productId: string,
    public readonly warehouseId: string,
    public quantity: number,
    public readonly receivedDate: Date,
    public readonly notes: string | null,
  ) {}

  static create(data: {
    id: string;
    lotNumber: string;
    productId: string;
    warehouseId: string;
    quantity: number;
    notes?: string;
  }): LotNumberEntity {
    return new LotNumberEntity(
      data.id, data.lotNumber, data.productId,
      data.warehouseId, data.quantity, new Date(),
      data.notes ?? null,
    );
  }
}