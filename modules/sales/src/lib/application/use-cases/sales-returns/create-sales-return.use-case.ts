import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService, DocumentSequenceService } from '@org/core';
import type { ISalesReturnRepository } from '../../../domain/repositories/sales-return.repository.interface';
import { SALES_RETURN_REPOSITORY } from '../../../domain/repositories/sales-return.repository.interface';
import type { IOrderRepository } from '../../../domain/repositories/order.repository.interface';
import { ORDER_REPOSITORY } from '../../../domain/repositories/order.repository.interface';
import { SalesReturnEntity } from '../../../domain/entities/sales-return.entity';
import { SalesReturnItemEntity } from '../../../domain/entities/sales-return-item.entity';
import { CreateSalesReturnDto } from '../../dtos/sales-return.dto';

@Injectable()
export class CreateSalesReturnUseCase {
  constructor(
    @Inject(SALES_RETURN_REPOSITORY)
    private salesReturnRepository: ISalesReturnRepository,
    @Inject(ORDER_REPOSITORY)
    private orderRepository: IOrderRepository,
    private prisma: PrismaService,
    private documentSequenceService: DocumentSequenceService,
  ) {}

  async execute(dto: CreateSalesReturnDto): Promise<SalesReturnEntity> {
    const order = await this.orderRepository.findById(dto.orderId);
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'CONFIRMED' && order.status !== 'DELIVERED')
      throw new Error('Order must be CONFIRMED or DELIVERED to create return');

    const branch = await this.prisma.branch.findUnique({ where: { id: order.branchId } });
    if (!branch) throw new NotFoundException('Branch not found');
    const companyId = branch.companyId;

    const returnNumber = await this.documentSequenceService.getNextNumber(
      companyId, 'sales', 'return', 'RET'
    );

    const returnId = randomUUID();
    const salesReturn = SalesReturnEntity.create({
      id: returnId,
      returnNumber,
      reason: dto.reason,
      orderId: dto.orderId,
      customerId: dto.customerId,
      notes: dto.notes,
    });

    salesReturn.items = dto.items.map((item) =>
      SalesReturnItemEntity.create({
        id: randomUUID(),
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        returnId,
      })
    );

    salesReturn.calculateTotal();

    return this.salesReturnRepository.create(salesReturn);
  }
}