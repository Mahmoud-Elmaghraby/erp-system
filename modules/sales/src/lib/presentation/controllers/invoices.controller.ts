import { Controller, Get, Post, Patch, Body, Param, UseGuards, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard, CurrentUser } from '@org/core';
import { CreateInvoiceUseCase } from '../../application/use-cases/invoices/create-invoice.use-case';
import { PayInvoiceUseCase } from '../../application/use-cases/invoices/pay-invoice.use-case';
import { CreateInvoiceDto, PayInvoiceDto } from '../../application/dtos/invoice.dto';
import { INVOICE_REPOSITORY } from '../../domain/repositories/invoice.repository.interface';
import type { IInvoiceRepository } from '../../domain/repositories/invoice.repository.interface';

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(
    private createInvoiceUseCase: CreateInvoiceUseCase,
    private payInvoiceUseCase: PayInvoiceUseCase,
    @Inject(INVOICE_REPOSITORY)
    private invoiceRepository: IInvoiceRepository,
  ) {}

  @Get()
  @RequirePermission('sales.invoices.view')
  findAll(
    @CurrentUser('companyId') companyId: string,
    @Query('orderId') orderId?: string,
  ) {
    if (orderId) return this.invoiceRepository.findAll(orderId);
    return this.invoiceRepository.findByCompany(companyId);
  }

  @Get(':id')
  @RequirePermission('sales.invoices.view')
  findOne(@Param('id') id: string) {
    return this.invoiceRepository.findById(id);
  }

  @Post()
  @RequirePermission('sales.invoices.create')
  create(@Body() dto: CreateInvoiceDto) {
    return this.createInvoiceUseCase.execute(dto);
  }

  @Patch(':id/pay')
  @RequirePermission('sales.invoices.pay')
  pay(@Param('id') id: string, @Body() dto: PayInvoiceDto) {
    return this.payInvoiceUseCase.execute(id, dto);
  }

  @Patch(':id/cancel')
  @RequirePermission('sales.invoices.edit')
  async cancel(@Param('id') id: string) {
    const invoice = await this.invoiceRepository.findById(id);
    if (!invoice) throw new Error('Invoice not found');
    invoice.cancel();
    return this.invoiceRepository.update(id, { status: 'CANCELLED' });
  }
}