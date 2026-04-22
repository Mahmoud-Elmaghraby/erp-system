export class SalesReturnItemEntity {
  constructor(
    public readonly id: string,
    public productId: string,
    public quantity: number,
    public unitPrice: number,
    public total: number,
    public returnId: string,
  ) {}

  static create(data: {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    returnId: string;
  }): SalesReturnItemEntity {
    return new SalesReturnItemEntity(
      data.id, data.productId, data.quantity,
      data.unitPrice, data.quantity * data.unitPrice,
      data.returnId,
    );
  }
}