import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IOrderRepository } from '../../../domain/repositories/order.repository.interface';
import { ORDER_REPOSITORY } from '../../../domain/repositories/order.repository.interface';
import { OutboxService, PrismaService } from '@org/core';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ConfirmOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private orderRepository: IOrderRepository,
    private outboxService: OutboxService,
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(orderId: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');

    order.confirm();

    const branch = await this.prisma.branch.findUnique({ where: { id: order.branchId } });
    if (!branch) throw new NotFoundException('Branch not found');
    const companyId = branch.companyId;

    const eventPayload = {
      orderId: order.id,
      branchId: order.branchId,
      companyId,
      items: order.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
    };

    await this.prisma.$transaction(async (tx) => {
      await this.orderRepository.update(orderId, { status: 'CONFIRMED' });
      await this.outboxService.publish('order.confirmed', eventPayload, tx);
    });

    this.eventEmitter.emit('order.confirmed', eventPayload);
  }
}