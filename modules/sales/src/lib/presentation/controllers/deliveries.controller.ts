import { Controller, Get, Post, Patch, Body, Param, UseGuards, Inject, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard } from '@org/core';
import type { IDeliveryRepository } from '../../domain/repositories/delivery.repository.interface';
import { DELIVERY_REPOSITORY } from '../../domain/repositories/delivery.repository.interface';
import { CreateDeliveryUseCase } from '../../application/use-cases/deliveries/create-delivery.use-case';
import { ConfirmDeliveryUseCase } from '../../application/use-cases/deliveries/confirm-delivery.use-case';
import { CreateDeliveryDto } from '../../application/dtos/delivery.dto';

@ApiTags('Deliveries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('deliveries')
export class DeliveriesController {
  constructor(
    @Inject(DELIVERY_REPOSITORY)
    private deliveryRepository: IDeliveryRepository,
    private createDeliveryUseCase: CreateDeliveryUseCase,
    private confirmDeliveryUseCase: ConfirmDeliveryUseCase,
  ) {}

@Get()
@RequirePermission('sales.deliveries.view')
findByBranch(@Query('branchId') branchId: string) {
  return this.deliveryRepository.findByBranch(branchId);
}

  @Get(':id')
  @RequirePermission('sales.deliveries.view')
  findOne(@Param('id') id: string) {
    return this.deliveryRepository.findById(id);
  }

  @Post()
  @RequirePermission('sales.deliveries.create')
  create(@Body() dto: CreateDeliveryDto) {
    return this.createDeliveryUseCase.execute(dto);
  }

  @Patch(':id/confirm')
  @RequirePermission('sales.deliveries.confirm')
  confirm(@Param('id') id: string) {
    return this.confirmDeliveryUseCase.execute(id);
  }
}