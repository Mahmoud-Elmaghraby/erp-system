export type SerialNumberStatus = 'IN_STOCK' | 'SOLD' | 'RETURNED' | 'DEFECTIVE';

export class SerialNumberEntity {
  constructor(
    public readonly id: string,
    public readonly serialNumber: string,
    public readonly productId: string,
    public readonly warehouseId: string,
    public status: SerialNumberStatus,
    public readonly notes: string | null,
  ) {}

  static create(data: {
    id: string;
    serialNumber: string;
    productId: string;
    warehouseId: string;
    notes?: string;
  }): SerialNumberEntity {
    return new SerialNumberEntity(
      data.id, data.serialNumber, data.productId,
      data.warehouseId, 'IN_STOCK', data.notes ?? null,
    );
  }

  sell(): void { this.status = 'SOLD'; }
  return(): void { this.status = 'RETURNED'; }
  defect(): void { this.status = 'DEFECTIVE'; }
}