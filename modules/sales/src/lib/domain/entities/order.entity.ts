import { OrderItem } from './order-item.entity';

export type OrderStatus = 'DRAFT' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';

export class OrderEntity {
  constructor(
    public readonly id: string,
    public orderNumber: string,
    public status: OrderStatus,
    public branchId: string,
    public customerId: string | null,
    public notes: string | null,
    public totalAmount: number,
    public items: OrderItem[],
  ) {}

  static create(data: {
    id: string;
    orderNumber: string;
    branchId: string;
    customerId?: string;
    notes?: string;
  }): OrderEntity {
    return new OrderEntity(
      data.id, data.orderNumber, 'DRAFT',
      data.branchId, data.customerId ?? null,
      data.notes ?? null, 0, [],
    );
  }

  confirm(): void {
    if (this.status !== 'DRAFT') throw new Error('Only DRAFT orders can be confirmed');
    this.status = 'CONFIRMED';
  }

  cancel(): void {
    if (this.status === 'DELIVERED') throw new Error('Cannot cancel delivered orders');
    this.status = 'CANCELLED';
  }

  deliver(): void {
    if (this.status !== 'CONFIRMED') throw new Error('Only CONFIRMED orders can be delivered');
    this.status = 'DELIVERED';
  }

  calculateTotal(): void {
    this.totalAmount = this.items.reduce((sum, item) => sum + item.total, 0);
  }
}