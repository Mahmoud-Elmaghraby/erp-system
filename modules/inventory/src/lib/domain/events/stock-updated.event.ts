export class StockUpdatedEvent {
  constructor(
    public readonly warehouseId: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly type: 'IN' | 'OUT' | 'TRANSFER',
  ) {}
}