export class DeliveryItemEntity {
  constructor(
    public readonly id: string,
    public productId: string,
    public quantity: number,
    public deliveryId: string,
  ) {}

  static create(data: {
    id: string;
    productId: string;
    quantity: number;
    deliveryId: string;
  }): DeliveryItemEntity {
    return new DeliveryItemEntity(
      data.id, data.productId, data.quantity, data.deliveryId,
    );
  }
}