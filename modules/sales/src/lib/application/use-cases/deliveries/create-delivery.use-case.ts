import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService, DocumentSequenceService } from '@org/core';
import type { IDeliveryRepository } from '../../../domain/repositories/delivery.repository.interface';
import { DELIVERY_REPOSITORY } from '../../../domain/repositories/delivery.repository.interface';
import type { IOrderRepository } from '../../../domain/repositories/order.repository.interface';
import { ORDER_REPOSITORY } from '../../../domain/repositories/order.repository.interface';
import { DeliveryEntity } from '../../../domain/entities/delivery.entity';
import { DeliveryItemEntity } from '../../../domain/entities/delivery-item.entity';
import { CreateDeliveryDto } from '../../dtos/delivery.dto';

@Injectable()
export class CreateDeliveryUseCase {
  constructor(
    @Inject(DELIVERY_REPOSITORY)
    private deliveryRepository: IDeliveryRepository,
    @Inject(ORDER_REPOSITORY)
    private orderRepository: IOrderRepository,
    private prisma: PrismaService,
    private documentSequenceService: DocumentSequenceService,
  ) {}

  async execute(dto: CreateDeliveryDto): Promise<DeliveryEntity> {
    const order = await this.orderRepository.findById(dto.orderId);
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'CONFIRMED')
      throw new Error('Order must be CONFIRMED to create delivery');

    const branch = await this.prisma.branch.findUnique({ where: { id: dto.branchId } });
    if (!branch) throw new NotFoundException('Branch not found');
    const companyId = branch.companyId;

    const deliveryNumber = await this.documentSequenceService.getNextNumber(
      companyId, 'sales', 'delivery', 'DEL'
    );

    const deliveryId = randomUUID();
    const delivery = DeliveryEntity.create({
      id: deliveryId,
      deliveryNumber,
      orderId: dto.orderId,
      warehouseId: dto.warehouseId,
      branchId: dto.branchId,
      notes: dto.notes,
      deliveryDate: dto.deliveryDate,
    });

    delivery.items = dto.items.map((item) =>
      DeliveryItemEntity.create({
        id: randomUUID(),
        productId: item.productId,
        quantity: item.quantity,
        deliveryId,
      })
    );

    return this.deliveryRepository.create(delivery);
  }
}