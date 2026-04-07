import { Inject, Injectable } from '@nestjs/common';
import type { IOrderRepository } from '../../../domain/repositories/order.repository.interface';
import { ORDER_REPOSITORY } from '../../../domain/repositories/order.repository.interface';
import { OrderEntity } from '../../../domain/entities/order.entity';
import { OrderItem } from '../../../domain/entities/order-item.entity';
import { CreateOrderDto } from '../../dtos/order.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private orderRepository: IOrderRepository,
  ) {}

  async execute(dto: CreateOrderDto): Promise<OrderEntity> {
    const orderId = randomUUID();
    const orderNumber = `ORD-${Date.now()}`;

    const order = OrderEntity.create({
      id: orderId,
      orderNumber,
      branchId: dto.branchId,
      customerId: dto.customerId,
      notes: dto.notes,
    });

    order.items = dto.items.map((item) =>
      OrderItem.create({
        id: randomUUID(),
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })
    );

    order.calculateTotal();
    return this.orderRepository.create(order);
  }
}