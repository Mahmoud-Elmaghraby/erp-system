import { Controller, Get, Post, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard } from '@org/core';
import { CreatePurchaseReceiptUseCase } from '../../application/use-cases/receipts/create-receipt.use-case';
import type { IPurchaseReceiptRepository } from '../../domain/repositories/purchase-receipt.repository.interface';
import { PURCHASE_RECEIPT_REPOSITORY } from '../../domain/repositories/purchase-receipt.repository.interface';
import { CreatePurchaseReceiptDto } from '../../application/dtos/purchase-receipt.dto';

@ApiTags('Purchase Receipts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('purchase-receipts')
export class PurchaseReceiptsController {
  constructor(
    private createReceiptUseCase: CreatePurchaseReceiptUseCase,
    @Inject(PURCHASE_RECEIPT_REPOSITORY)
    private receiptRepository: IPurchaseReceiptRepository,
  ) {}

  @Get('order/:orderId')
  @RequirePermission('purchasing.receipts.view')
  findByOrder(@Param('orderId') orderId: string) {
    return this.receiptRepository.findByOrder(orderId);
  }

  @Post()
  @RequirePermission('purchasing.receipts.create')
  create(@Body() dto: CreatePurchaseReceiptDto) {
    return this.createReceiptUseCase.execute(dto);
  }
}