export type VendorBillStatus = 'UNPAID' | 'PAID' | 'PARTIAL';

export class VendorBillEntity {
  constructor(
    public readonly id: string,
    public readonly billNumber: string,
    public status: VendorBillStatus,
    public readonly totalAmount: number,
    public paidAmount: number,
    public readonly orderId: string,
    public readonly dueDate: Date | null,
  ) {}

  static create(data: {
    id: string;
    billNumber: string;
    orderId: string;
    totalAmount: number;
    dueDate?: Date;
  }): VendorBillEntity {
    return new VendorBillEntity(
      data.id, data.billNumber, 'UNPAID',
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