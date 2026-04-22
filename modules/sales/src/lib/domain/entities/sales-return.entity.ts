import type { SalesReturnItemEntity } from './sales-return-item.entity';

export type SalesReturnStatus = 'DRAFT' | 'CONFIRMED' | 'CANCELLED';

export class SalesReturnEntity {
  constructor(
    public readonly id: string,
    public returnNumber: string,
    public status: SalesReturnStatus,
    public reason: string,
    public notes: string | null,
    public totalAmount: number,
    public orderId: string,
    public customerId: string | null,
    public items: SalesReturnItemEntity[],
    public readonly createdAt?: Date,
  ) {}

  static create(data: {
    id: string;
    returnNumber: string;
    reason: string;
    orderId: string;
    customerId?: string;
    notes?: string;
  }): SalesReturnEntity {
    return new SalesReturnEntity(
      data.id, data.returnNumber, 'DRAFT',
      data.reason, data.notes ?? null, 0,
      data.orderId, data.customerId ?? null, [],
    );
  }

  confirm(): void {
    if (this.status !== 'DRAFT')
      throw new Error('Only DRAFT returns can be confirmed');
    this.status = 'CONFIRMED';
  }

  cancel(): void {
    if (this.status === 'CONFIRMED')
      throw new Error('Cannot cancel confirmed return');
    this.status = 'CANCELLED';
  }

  calculateTotal(): void {
    this.totalAmount = this.items.reduce((s, i) => s + i.total, 0);
  }
}