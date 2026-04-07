export type InvoiceStatus = 'UNPAID' | 'PAID' | 'PARTIAL';

export class InvoiceEntity {
  constructor(
    public readonly id: string,
    public invoiceNumber: string,
    public status: InvoiceStatus,
    public totalAmount: number,
    public paidAmount: number,
    public orderId: string,
    public dueDate: Date | null,
  ) {}

  static create(data: {
    id: string;
    invoiceNumber: string;
    orderId: string;
    totalAmount: number;
    dueDate?: Date;
  }): InvoiceEntity {
    return new InvoiceEntity(
      data.id, data.invoiceNumber, 'UNPAID',
      data.totalAmount, 0, data.orderId,
      data.dueDate ?? null,
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
}