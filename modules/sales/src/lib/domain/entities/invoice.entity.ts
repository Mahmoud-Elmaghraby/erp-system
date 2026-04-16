export type InvoiceStatus = 'UNPAID' | 'PAID' | 'PARTIAL' | 'CANCELLED';

export class InvoiceEntity {
  constructor(
    public readonly id: string,
    public invoiceNumber: string,
    public status: InvoiceStatus,
    public untaxedAmount: number,
    public taxAmount: number,
    public totalAmount: number,
    public paidAmount: number,
    public discountAmount: number,
    public currency: string,
    public exchangeRate: number,
    public orderId: string,
    public dueDate: Date | null,
    public paymentTermId: string | null,
    // E-Invoice Fields
    public readonly uuid: string,
    public dateTimeIssued: Date,
    public etaStatus: string | null,
    public etaUUID: string | null,
    public zatcaStatus: string | null,
    public qrCode: string | null,
    public companyId?: string,
  ) {}

  static create(data: {
    id: string;
    invoiceNumber: string;
    orderId: string;
    untaxedAmount: number;
    taxAmount: number;
    totalAmount: number;
    discountAmount?: number;
    currency?: string;
    exchangeRate?: number;
    dueDate?: Date;
    paymentTermId?: string;
    companyId?: string;
  }): InvoiceEntity {
    return new InvoiceEntity(
      data.id,
      data.invoiceNumber,
      'UNPAID',
      data.untaxedAmount,
      data.taxAmount,
      data.totalAmount,
      0,
      data.discountAmount ?? 0,
      data.currency ?? 'EGP',
      data.exchangeRate ?? 1,
      data.orderId,
      data.dueDate ?? null,
      data.paymentTermId ?? null,
      data.id, // uuid
      new Date(),
      null, null, null, null,
      data.companyId,
    );
  }

  pay(amount: number): void {
    this.paidAmount += amount;
    if (this.paidAmount >= this.totalAmount) {
      this.status = 'PAID';
    } else {
      this.status = 'PARTIAL';
    }
  }

  cancel(): void {
    if (this.status === 'PAID') throw new Error('Cannot cancel paid invoice');
    this.status = 'CANCELLED';
  }

  getRemainingAmount(): number {
    return this.totalAmount - this.paidAmount;
  }

  isOverdue(): boolean {
    if (!this.dueDate) return false;
    return new Date() > this.dueDate && this.status !== 'PAID';
  }
}