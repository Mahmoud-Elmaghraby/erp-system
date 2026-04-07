import { Controller, Get, Post, Patch, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard } from '@org/core';
import type { IInvoiceRepository } from '../../domain/repositories/invoice.repository.interface';
import { INVOICE_REPOSITORY } from '../../domain/repositories/invoice.repository.interface';
import { InvoiceEntity } from '../../domain/entities/invoice.entity';
import { CreateInvoiceDto, PayInvoiceDto } from '../../application/dtos/invoice.dto';
import { randomUUID } from 'crypto';
import { PrismaService } from '@org/core';

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private invoiceRepository: IInvoiceRepository,
    private prisma: PrismaService,
  ) {}

  @Get('order/:orderId')
  @RequirePermission('sales.invoices.view')
  findAll(@Param('orderId') orderId: string) {
    return this.invoiceRepository.findAll(orderId);
  }

  @Post()
  @RequirePermission('sales.invoices.create')
  async create(@Body() dto: CreateInvoiceDto) {
    const order = await this.prisma.salesOrder.findUnique({ where: { id: dto.orderId } });
    if (!order) throw new Error('Order not found');
    const invoice = InvoiceEntity.create({
      id: randomUUID(),
      invoiceNumber: `INV-${Date.now()}`,
      orderId: dto.orderId,
      totalAmount: Number(order.totalAmount),
      dueDate: dto.dueDate,
    });
    return this.invoiceRepository.create(invoice);
  }

  @Patch(':id/pay')
  @RequirePermission('sales.invoices.pay')
  async pay(@Param('id') id: string, @Body() dto: PayInvoiceDto) {
    const invoice = await this.invoiceRepository.findById(id);
    if (!invoice) throw new Error('Invoice not found');
    invoice.pay(dto.amount);
    return this.invoiceRepository.update(id, { status: invoice.status, paidAmount: invoice.paidAmount });
  }
}