import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DocumentSequenceService, PrismaService, OutboxService } from '@org/core';
import type { IQuotationRepository } from '../../../domain/repositories/quotation.repository.interface';
import { QUOTATION_REPOSITORY } from '../../../domain/repositories/quotation.repository.interface';
import type { IOrderRepository } from '../../../domain/repositories/order.repository.interface';
import { ORDER_REPOSITORY } from '../../../domain/repositories/order.repository.interface';
import { OrderEntity } from '../../../domain/entities/order.entity';
import { OrderItem } from '../../../domain/entities/order-item.entity';

@Injectable()
export class ConfirmQuotationUseCase {
  constructor(
    @Inject(QUOTATION_REPOSITORY)
    private quotationRepository: IQuotationRepository,
    @Inject(ORDER_REPOSITORY)
    private orderRepository: IOrderRepository,
    private documentSequenceService: DocumentSequenceService,
    private outboxService: OutboxService,
    private prisma: PrismaService,
  ) {}

  async execute(quotationId: string): Promise<OrderEntity> {
    const quotation = await this.quotationRepository.findById(quotationId);
    if (!quotation) throw new NotFoundException('Quotation not found');

    quotation.confirm();

    const branch = await this.prisma.branch.findUnique({ where: { id: quotation.branchId } });
    if (!branch) {
      throw new NotFoundException('Branch not found');
    }
    const companyId = branch.companyId;

    const orderNumber = await this.documentSequenceService.getNextNumber(
      companyId, 'sales', 'order', 'SO'
    );

    const orderId = randomUUID();
    const order = OrderEntity.create({
      id: orderId,
      orderNumber,
      branchId: quotation.branchId,
      customerId: quotation.customerId ?? undefined,
      notes: quotation.notes ?? undefined,
    });

    order.items = quotation.items.map((item) =>
      new OrderItem(
        randomUUID(), orderId,
        item.productId, item.quantity,
        item.unitPrice, item.total,
      )
    );
    order.calculateTotal();

    await this.prisma.$transaction(async (tx) => {
      await this.quotationRepository.update(quotationId, { status: 'CONFIRMED' });
      await this.orderRepository.create(order);
      await this.outboxService.publish(
        'quotation.confirmed',
        { quotationId, orderId, companyId },
        tx,
      );
    });

    return order;
  }
}