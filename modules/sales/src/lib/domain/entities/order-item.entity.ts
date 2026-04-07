export class OrderItem {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly productId: string,
    public quantity: number,
    public unitPrice: number,
    public total: number,
  ) {}

  static create(data: {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
  }): OrderItem {
    return new OrderItem(
      data.id, data.orderId, data.productId,
      data.quantity, data.unitPrice,
      data.quantity * data.unitPrice,
    );
  }
}