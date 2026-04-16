import { Inject, Injectable } from '@nestjs/common';
import type { IOrderRepository } from '../../../domain/repositories/order.repository.interface';
import { ORDER_REPOSITORY } from '../../../domain/repositories/order.repository.interface';
import { OrderEntity } from '../../../domain/entities/order.entity';
import { OrderItem } from '../../../domain/entities/order-item.entity';
import { CreateOrderDto } from '../../dtos/order.dto';
import { DocumentSequenceService, PrismaService } from '@org/core';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private orderRepository: IOrderRepository,
    private documentSequenceService: DocumentSequenceService,
    private prisma: PrismaService,
  ) {}

  async execute(dto: CreateOrderDto): Promise<OrderEntity> {
    const branch = await this.prisma.branch.findUnique({ where: { id: dto.branchId } });
    if (!branch) throw new Error('Branch not found');

    const orderNumber = await this.documentSequenceService.getNextNumber(
      branch.companyId, 'sales', 'order', 'SO'
    );

    const orderId = randomUUID();
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