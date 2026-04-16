import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PrismaService, OutboxService } from '@org/core';
import type { IDeliveryRepository } from '../../../domain/repositories/delivery.repository.interface';
import { DELIVERY_REPOSITORY } from '../../../domain/repositories/delivery.repository.interface';
import type { IOrderRepository } from '../../../domain/repositories/order.repository.interface';
import { ORDER_REPOSITORY } from '../../../domain/repositories/order.repository.interface';
import { DeliveryEntity } from '../../../domain/entities/delivery.entity';

@Injectable()
export class ConfirmDeliveryUseCase {
  constructor(
    @Inject(DELIVERY_REPOSITORY)
    private deliveryRepository: IDeliveryRepository,
    @Inject(ORDER_REPOSITORY)
    private orderRepository: IOrderRepository,
    private prisma: PrismaService,
    private outboxService: OutboxService,
  ) {}

  async execute(deliveryId: string): Promise<DeliveryEntity> {
    const delivery = await this.deliveryRepository.findById(deliveryId);
    if (!delivery) throw new NotFoundException('Delivery not found');

    delivery.confirm();

    const branch = await this.prisma.branch.findUnique({
      where: { id: delivery.branchId },
    });
    const companyId = branch!.companyId;

    await this.prisma.$transaction(async (tx) => {
      await this.deliveryRepository.update(deliveryId, { status: 'CONFIRMED' });

      // ابعت Event للـ Inventory عشان يخصم المخزون
      await this.outboxService.publish(
        'delivery.confirmed',
        {
          deliveryId: delivery.id,
          orderId: delivery.orderId,
          warehouseId: delivery.warehouseId,
          companyId,
          items: delivery.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        },
        tx,
      );
    });

    // لو كل الـ Items اتسلمت — حدّث الـ Order لـ DELIVERED
    const order = await this.orderRepository.findById(delivery.orderId);
    if (order) {
      order.deliver();
      await this.orderRepository.update(delivery.orderId, { status: 'DELIVERED' });
    }

    return delivery;
  }
}