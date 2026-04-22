import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OutboxService, PrismaService } from '@org/core';
import type { IInvoiceRepository } from '../../../domain/repositories/invoice.repository.interface';
import { INVOICE_REPOSITORY } from '../../../domain/repositories/invoice.repository.interface';
import { PayInvoiceDto } from '../../dtos/invoice.dto';
import { InvoiceEntity } from '../../../domain/entities/invoice.entity';

@Injectable()
export class PayInvoiceUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private invoiceRepository: IInvoiceRepository,
    private prisma: PrismaService,
    private outboxService: OutboxService,
  ) {}

  async execute(invoiceId: string, dto: PayInvoiceDto): Promise<InvoiceEntity> {
    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice) throw new NotFoundException('Invoice not found');

    const order = await this.prisma.salesOrder.findUnique({
      where: { id: invoice.orderId },
    });
    if (!order) throw new NotFoundException('Order not found');

    const branch = await this.prisma.branch.findUnique({
      where: { id: order.branchId },
    });
    const companyId = branch?.companyId;
    if (!companyId) throw new NotFoundException('Company not found');

    invoice.pay(dto.amount);

    await this.prisma.$transaction(async (tx) => {
      await this.invoiceRepository.update(invoiceId, {
        status: invoice.status,
        paidAmount: invoice.paidAmount,
      });
      await this.outboxService.publish(
        'invoice.paid',
        {
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          companyId,
          amount: dto.amount,
          paymentMethod: dto.paymentMethod,
          date: new Date(),
        },
        tx,
      );
    });

    return invoice;
  }
}