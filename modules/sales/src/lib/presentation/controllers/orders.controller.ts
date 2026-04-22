import { Controller, Get, Post, Patch, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard, CurrentUser } from '@org/core';
import { CreateOrderUseCase } from '../../application/use-cases/orders/create-order.use-case';
import { ConfirmOrderUseCase } from '../../application/use-cases/orders/confirm-order.use-case';
import type { IOrderRepository } from '../../domain/repositories/order.repository.interface';
import { ORDER_REPOSITORY } from '../../domain/repositories/order.repository.interface';
import { CreateOrderDto } from '../../application/dtos/order.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    private createOrderUseCase: CreateOrderUseCase,
    private confirmOrderUseCase: ConfirmOrderUseCase,
    @Inject(ORDER_REPOSITORY)
    private orderRepository: IOrderRepository,
  ) {}

  @Get()
  @RequirePermission('sales.orders.view')
  findAll(@CurrentUser('companyId') companyId: string) {
    return this.orderRepository.findAll(companyId);
  }

  @Get(':id')
  @RequirePermission('sales.orders.view')
  findOne(@Param('id') id: string) {
    return this.orderRepository.findById(id);
  }

  @Post()
  @RequirePermission('sales.orders.create')
  create(@Body() dto: CreateOrderDto) {
    return this.createOrderUseCase.execute(dto);
  }

  @Patch(':id/confirm')
  @RequirePermission('sales.orders.confirm')
  confirm(@Param('id') id: string) {
    return this.confirmOrderUseCase.execute(id);
  }

  @Patch(':id/cancel')
  @RequirePermission('sales.orders.edit')
  async cancel(@Param('id') id: string) {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new Error('Order not found');
    order.cancel();
    return this.orderRepository.update(id, { status: 'CANCELLED' });
  }
}