import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PrismaService, OutboxService } from '@org/core';
import type { ISalesReturnRepository } from '../../../domain/repositories/sales-return.repository.interface';
import { SALES_RETURN_REPOSITORY } from '../../../domain/repositories/sales-return.repository.interface';
import { SalesReturnEntity } from '../../../domain/entities/sales-return.entity';

@Injectable()
export class ConfirmSalesReturnUseCase {
  constructor(
    @Inject(SALES_RETURN_REPOSITORY)
    private salesReturnRepository: ISalesReturnRepository,
    private prisma: PrismaService,
    private outboxService: OutboxService,
  ) {}

  async execute(returnId: string): Promise<SalesReturnEntity> {
    const salesReturn = await this.salesReturnRepository.findById(returnId);
    if (!salesReturn) throw new NotFoundException('Sales return not found');

    salesReturn.confirm();

    const order = await this.prisma.salesOrder.findUnique({
      where: { id: salesReturn.orderId },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    const branch = await this.prisma.branch.findUnique({
      where: { id: order.branchId },
    });
    if (!branch) {
      throw new NotFoundException('Branch not found');
    }
    const companyId = branch.companyId;

    await this.prisma.$transaction(async (tx) => {
      await this.salesReturnRepository.update(returnId, { status: 'CONFIRMED' });

      // ابعت Event للـ Inventory عشان يرجع المخزون
      await this.outboxService.publish(
        'sales.return.confirmed',
        {
          returnId: salesReturn.id,
          orderId: salesReturn.orderId,
          companyId,
          items: salesReturn.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        },
        tx,
      );
    });

    return salesReturn;
  }
}