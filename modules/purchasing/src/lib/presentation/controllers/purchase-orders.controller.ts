import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard } from '@org/core';
import { CreatePurchaseOrderUseCase } from '../../application/use-cases/orders/create-order.use-case';
import { ConfirmPurchaseOrderUseCase } from '../../application/use-cases/orders/confirm-order.use-case';
import type { IPurchaseOrderRepository } from '../../domain/repositories/purchase-order.repository.interface';
import { PURCHASE_ORDER_REPOSITORY } from '../../domain/repositories/purchase-order.repository.interface';
import { CreatePurchaseOrderDto } from '../../application/dtos/purchase-order.dto';

@ApiTags('Purchase Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(
    private createOrderUseCase: CreatePurchaseOrderUseCase,
    private confirmOrderUseCase: ConfirmPurchaseOrderUseCase,
    @Inject(PURCHASE_ORDER_REPOSITORY)
    private orderRepository: IPurchaseOrderRepository,
  ) {}

  @Get()
  @RequirePermission('purchasing.orders.view')
  findAll(@Query('branchId') branchId?: string) {
    return this.orderRepository.findAll(branchId);
  }

  @Get(':id')
  @RequirePermission('purchasing.orders.view')
  findOne(@Param('id') id: string) { return this.orderRepository.findById(id); }

  @Post()
  @RequirePermission('purchasing.orders.create')
  create(@Body() dto: CreatePurchaseOrderDto) { return this.createOrderUseCase.execute(dto); }

  @Patch(':id/confirm')
  @RequirePermission('purchasing.orders.confirm')
  confirm(@Param('id') id: string) { return this.confirmOrderUseCase.execute(id); }
}