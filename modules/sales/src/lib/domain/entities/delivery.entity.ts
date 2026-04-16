import type { DeliveryItemEntity } from './delivery-item.entity';

export type DeliveryStatus = 'DRAFT' | 'CONFIRMED' | 'DONE' | 'CANCELLED';

export class DeliveryEntity {
  constructor(
    public readonly id: string,
    public deliveryNumber: string,
    public status: DeliveryStatus,
    public orderId: string,
    public warehouseId: string,
    public branchId: string,
    public notes: string | null,
    public deliveryDate: Date | null,
    public items: DeliveryItemEntity[],
    public readonly createdAt?: Date,
  ) {}

  static create(data: {
    id: string;
    deliveryNumber: string;
    orderId: string;
    warehouseId: string;
    branchId: string;
    notes?: string;
    deliveryDate?: Date;
  }): DeliveryEntity {
    return new DeliveryEntity(
      data.id, data.deliveryNumber, 'DRAFT',
      data.orderId, data.warehouseId, data.branchId,
      data.notes ?? null, data.deliveryDate ?? null, [],
    );
  }

  confirm(): void {
    if (this.status !== 'DRAFT')
      throw new Error('Only DRAFT deliveries can be confirmed');
    (this as any).status = 'CONFIRMED';
  }

  complete(): void {
    if (this.status !== 'CONFIRMED')
      throw new Error('Only CONFIRMED deliveries can be completed');
    (this as any).status = 'DONE';
  }

  cancel(): void {
    if (this.status === 'DONE')
      throw new Error('Cannot cancel completed delivery');
    (this as any).status = 'CANCELLED';
  }
}