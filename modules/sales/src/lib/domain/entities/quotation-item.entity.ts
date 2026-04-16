export class QuotationItemEntity {
  constructor(
    public readonly id: string,
    public productId: string,
    public quantity: number,
    public unitPrice: number,
    public discount: number,
    public subtotal: number,
    public taxAmount: number,
    public total: number,
    public taxId: string | null,
    public quotationId: string,
  ) {}

  static create(data: {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    taxAmount?: number;
    quotationId: string;
    taxId?: string;
  }): QuotationItemEntity {
    const discount = data.discount ?? 0;
    const subtotal = data.quantity * data.unitPrice - discount;
    const taxAmount = data.taxAmount ?? 0;
    const total = subtotal + taxAmount;
    return new QuotationItemEntity(
      data.id, data.productId, data.quantity,
      data.unitPrice, discount, subtotal,
      taxAmount, total, data.taxId ?? null, data.quotationId,
    );
  }
}