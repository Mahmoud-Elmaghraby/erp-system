import { OrderEntity } from '../entities/order.entity';

export interface IOrderRepository {
  findAll(companyId: string): Promise<OrderEntity[]>;
  findById(id: string): Promise<OrderEntity | null>;
  create(order: OrderEntity): Promise<OrderEntity>;
  update(id: string, data: Partial<OrderEntity>): Promise<OrderEntity>;
}

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';