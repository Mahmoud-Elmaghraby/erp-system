import type { DeliveryEntity } from '../entities/delivery.entity';

export interface IDeliveryRepository {
  findAll(orderId: string): Promise<DeliveryEntity[]>;
  findByBranch(branchId: string): Promise<DeliveryEntity[]>; // ✅ جديد
  findById(id: string): Promise<DeliveryEntity | null>;
  create(delivery: DeliveryEntity): Promise<DeliveryEntity>;
  update(id: string, data: Partial<DeliveryEntity>): Promise<DeliveryEntity>;
}

export const DELIVERY_REPOSITORY = 'DELIVERY_REPOSITORY';