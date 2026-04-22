import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IPurchaseOrderRepository } from '../../../domain/repositories/purchase-order.repository.interface';
import { PURCHASE_ORDER_REPOSITORY } from '../../../domain/repositories/purchase-order.repository.interface';

@Injectable()
export class ConfirmPurchaseOrderUseCase {
  constructor(
    @Inject(PURCHASE_ORDER_REPOSITORY)
    private orderRepository: IPurchaseOrderRepository,
  ) {}

  async execute(orderId: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');
    order.confirm();
    await this.orderRepository.update(orderId, { status: 'CONFIRMED' });
  }
}