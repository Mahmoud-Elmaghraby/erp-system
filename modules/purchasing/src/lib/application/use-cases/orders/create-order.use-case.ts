import { Inject, Injectable } from '@nestjs/common';
import type { IPurchaseOrderRepository } from '../../../domain/repositories/purchase-order.repository.interface';
import { PURCHASE_ORDER_REPOSITORY } from '../../../domain/repositories/purchase-order.repository.interface';
import { PurchaseOrderEntity } from '../../../domain/entities/purchase-order.entity';
import { CreatePurchaseOrderDto } from '../../dtos/purchase-order.dto';
import { DocumentSequenceService } from '@org/core';
import { randomUUID } from 'crypto';

@Injectable()
export class CreatePurchaseOrderUseCase {
  constructor(
    @Inject(PURCHASE_ORDER_REPOSITORY)
    private orderRepository: IPurchaseOrderRepository,
    private documentSequenceService: DocumentSequenceService,
  ) {}

  async execute(dto: CreatePurchaseOrderDto): Promise<PurchaseOrderEntity> {
    const orderNumber = await this.documentSequenceService.getNextNumber(
      dto.branchId, 'purchasing', 'order', 'PO'
    );

    const order = PurchaseOrderEntity.create({
      id: randomUUID(),
      orderNumber,
      ...dto,
      items: dto.items.map(i => ({ id: randomUUID(), ...i })),
    });

    return this.orderRepository.create(order);
  }
}