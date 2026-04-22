export class StockLowEvent {
  constructor(
    public readonly warehouseId: string,
    public readonly productId: string,
    public readonly currentQuantity: number,
    public readonly minStock: number,
  ) {}
}