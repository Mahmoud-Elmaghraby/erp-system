export class OrderConfirmedEvent {
  constructor(
    public readonly orderId: string,
    public readonly branchId: string,
    public readonly items: Array<{
      productId: string;
      quantity: number;
    }>,
  ) {}
}