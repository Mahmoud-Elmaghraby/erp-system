import type { QuotationItemEntity } from './quotation-item.entity';

export type QuotationStatus = 'DRAFT' | 'SENT' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED';

export class QuotationEntity {
  constructor(
    public readonly id: string,
    public quotationNumber: string,
    public status: QuotationStatus,
    public branchId: string,
    public customerId: string | null,
    public notes: string | null,
    public validUntil: Date | null,
    public untaxedAmount: number,
    public taxAmount: number,
    public totalAmount: number,
    public discountAmount: number,
    public currency: string,
    public exchangeRate: number,
    public paymentTermId: string | null,
    public items: QuotationItemEntity[],
    public readonly createdAt?: Date,
  ) {}

  static create(data: {
    id: string;
    quotationNumber: string;
    branchId: string;
    customerId?: string;
    notes?: string;
    validUntil?: Date;
    currency?: string;
    paymentTermId?: string;
  }): QuotationEntity {
    return new QuotationEntity(
      data.id, data.quotationNumber, 'DRAFT',
      data.branchId, data.customerId ?? null,
      data.notes ?? null, data.validUntil ?? null,
      0, 0, 0, 0,
      data.currency ?? 'EGP', 1,
      data.paymentTermId ?? null, [],
    );
  }

  confirm(): void {
    if (this.status !== 'DRAFT' && this.status !== 'SENT')
      throw new Error('Only DRAFT or SENT quotations can be confirmed');
    this.status = 'CONFIRMED';
  }

  send(): void {
    if (this.status !== 'DRAFT')
      throw new Error('Only DRAFT quotations can be sent');
    this.status = 'SENT';
  }

  cancel(): void {
    if (this.status === 'CONFIRMED')
      throw new Error('Cannot cancel confirmed quotation');
    this.status = 'CANCELLED';
  }

  calculateTotals(): void {
    this.untaxedAmount = this.items.reduce((s, i) => s + i.subtotal, 0) - this.discountAmount;
    this.taxAmount = this.items.reduce((s, i) => s + i.taxAmount, 0);
    this.totalAmount = this.untaxedAmount + this.taxAmount;
  }
}