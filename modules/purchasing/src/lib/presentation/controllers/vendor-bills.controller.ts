import { Controller, Get, Post, Patch, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard } from '@org/core';
import { CreateVendorBillUseCase } from '../../application/use-cases/bills/create-bill.use-case';
import { PayVendorBillUseCase } from '../../application/use-cases/bills/pay-bill.use-case';
import type { IVendorBillRepository } from '../../domain/repositories/vendor-bill.repository.interface';
import { VENDOR_BILL_REPOSITORY } from '../../domain/repositories/vendor-bill.repository.interface';
import { CreateVendorBillDto, PayVendorBillDto } from '../../application/dtos/vendor-bill.dto';

@ApiTags('Vendor Bills')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('vendor-bills')
export class VendorBillsController {
  constructor(
    private createBillUseCase: CreateVendorBillUseCase,
    private payBillUseCase: PayVendorBillUseCase,
    @Inject(VENDOR_BILL_REPOSITORY)
    private billRepository: IVendorBillRepository,
  ) {}

  @Get('order/:orderId')
  @RequirePermission('purchasing.bills.view')
  findByOrder(@Param('orderId') orderId: string) {
    return this.billRepository.findByOrder(orderId);
  }

  @Post()
  @RequirePermission('purchasing.bills.create')
  create(@Body() dto: CreateVendorBillDto) { return this.createBillUseCase.execute(dto); }

  @Patch(':id/pay')
  @RequirePermission('purchasing.bills.pay')
  pay(@Param('id') id: string, @Body() dto: PayVendorBillDto) {
    return this.payBillUseCase.execute(id, dto);
  }
}