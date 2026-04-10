import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard } from '@org/core';
import type { IPaymentTermRepository } from '../../domain/repositories/payment-term.repository.interface';
import { PAYMENT_TERM_REPOSITORY } from '../../domain/repositories/payment-term.repository.interface';
import { PaymentTermEntity } from '../../domain/entities/payment-term.entity';
import { CreatePaymentTermDto, UpdatePaymentTermDto } from '../../application/dtos/payment-term.dto';
import { randomUUID } from 'crypto';

@ApiTags('Payment Terms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('payment-terms')
export class PaymentTermsController {
  constructor(
    @Inject(PAYMENT_TERM_REPOSITORY)
    private paymentTermRepository: IPaymentTermRepository,
  ) {}

  @Get()
  @RequirePermission('accounting.payment-terms.view')
  findAll(@Query('companyId') companyId: string) {
    return this.paymentTermRepository.findAll(companyId);
  }

  @Get(':id')
  @RequirePermission('accounting.payment-terms.view')
  findOne(@Param('id') id: string) {
    return this.paymentTermRepository.findById(id);
  }

  @Post()
  @RequirePermission('accounting.payment-terms.create')
  create(@Body() dto: CreatePaymentTermDto) {
    const term = PaymentTermEntity.create({
      id: randomUUID(),
      ...dto,
      lines: dto.lines.map(l => ({ id: randomUUID(), ...l })),
    });
    return this.paymentTermRepository.create(term);
  }

  @Patch(':id')
  @RequirePermission('accounting.payment-terms.edit')
  update(@Param('id') id: string, @Body() dto: UpdatePaymentTermDto) {
    return this.paymentTermRepository.update(id, {
      ...dto,
      lines: dto.lines?.map(l => ({ id: randomUUID(), ...l })),
    });
  }

  @Delete(':id')
  @RequirePermission('accounting.payment-terms.delete')
  remove(@Param('id') id: string) {
    return this.paymentTermRepository.delete(id);
  }
}