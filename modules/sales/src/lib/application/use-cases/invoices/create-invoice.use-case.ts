import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { OutboxService, PrismaService, SettingsService, DocumentSequenceService } from '@org/core';
import type { IInvoiceRepository } from '../../../domain/repositories/invoice.repository.interface';
import { INVOICE_REPOSITORY } from '../../../domain/repositories/invoice.repository.interface';
import type { IOrderRepository } from '../../../domain/repositories/order.repository.interface';
import { ORDER_REPOSITORY } from '../../../domain/repositories/order.repository.interface';
import { InvoiceEntity } from '../../../domain/entities/invoice.entity';
import { CreateInvoiceDto } from '../../dtos/invoice.dto';

@Injectable()
export class CreateInvoiceUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private invoiceRepository: IInvoiceRepository,
    @Inject(ORDER_REPOSITORY)
    private orderRepository: IOrderRepository,
    private prisma: PrismaService,
    private settingsService: SettingsService,
    private outboxService: OutboxService,
    private documentSequenceService: DocumentSequenceService,
  ) {}

  async execute(dto: CreateInvoiceDto): Promise<InvoiceEntity> {
    const order = await this.orderRepository.findById(dto.orderId);
    if (!order) throw new NotFoundException('Order not found');

    const branch = await this.prisma.branch.findUnique({
      where: { id: order.branchId },
    });
    if (!branch) throw new NotFoundException('Branch not found');
    const companyId = branch.companyId;

    const taxEnabled = await this.settingsService.getSetting(companyId, 'accounting', 'taxEnabled');
    const taxMethod  = await this.settingsService.getSetting(companyId, 'accounting', 'taxMethod');

    let untaxedAmount = Number(order.totalAmount);
    let taxAmount = 0;
    let discountAmount = dto.discountAmount ?? 0;
    untaxedAmount -= discountAmount;

    if (taxEnabled === 'true' && dto.taxRate) {
      if (taxMethod === 'INCLUSIVE') {
        taxAmount = untaxedAmount - untaxedAmount / (1 + dto.taxRate / 100);
        untaxedAmount = untaxedAmount - taxAmount;
      } else {
        taxAmount = untaxedAmount * (dto.taxRate / 100);
      }
    }

    const totalAmount = untaxedAmount + taxAmount;

    const invoiceNumber = await this.documentSequenceService.getNextNumber(
      companyId, 'sales', 'invoice', 'INV'
    );

    const invoiceId = randomUUID();
    const invoice = InvoiceEntity.create({
      id: invoiceId,
      invoiceNumber,
      orderId: dto.orderId,
      untaxedAmount,
      taxAmount,
      totalAmount,
      discountAmount,
      currency: dto.currency ?? 'EGP',
      dueDate: dto.dueDate,
      paymentTermId: dto.paymentTermId,
      companyId,
    });

    await this.prisma.$transaction(async (tx) => {
      await this.invoiceRepository.create(invoice);
      await this.outboxService.publish(
        'invoice.created',
        {
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          orderId: invoice.orderId,
          companyId,
          untaxedAmount: invoice.untaxedAmount,
          taxAmount: invoice.taxAmount,
          totalAmount: invoice.totalAmount,
          currency: invoice.currency,
          date: invoice.dateTimeIssued,
        },
        tx,
      );
    });

    return invoice;
  }
}