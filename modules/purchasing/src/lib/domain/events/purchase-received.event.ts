export class PurchaseReceivedEvent {
  constructor(
    public readonly purchaseId: string,
    public readonly warehouseId: string,
    public readonly items: Array<{
      productId: string;
      quantity: number;
      unitCost: number;
    }>,
  ) {}
}