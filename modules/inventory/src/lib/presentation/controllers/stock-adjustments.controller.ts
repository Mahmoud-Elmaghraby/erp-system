import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard, CurrentUser } from '@org/core';
import { CreateStockAdjustmentUseCase } from '../../application/use-cases/stock/create-adjustment.use-case';
import { ConfirmStockAdjustmentUseCase } from '../../application/use-cases/stock/confirm-adjustment.use-case';
import type { IStockAdjustmentRepository } from '../../domain/repositories/stock-adjustment.repository.interface';
import { STOCK_ADJUSTMENT_REPOSITORY } from '../../domain/repositories/stock-adjustment.repository.interface';
import { CreateStockAdjustmentDto } from '../../application/dtos/stock-adjustment.dto';

@ApiTags('Stock Adjustments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('stock-adjustments')
export class StockAdjustmentsController {
  constructor(
    private createAdjustmentUseCase: CreateStockAdjustmentUseCase,
    private confirmAdjustmentUseCase: ConfirmStockAdjustmentUseCase,
    @Inject(STOCK_ADJUSTMENT_REPOSITORY)
    private adjustmentRepository: IStockAdjustmentRepository,
  ) {}

  @Get()
  @RequirePermission('inventory.adjustments.view')
  findAll(
    @CurrentUser('companyId') companyId: string,
    @Query('warehouseId') warehouseId?: string,
  ) {
    return this.adjustmentRepository.findAll(companyId, warehouseId);
  }

  @Post()
  @RequirePermission('inventory.adjustments.create')
  create(@Body() dto: CreateStockAdjustmentDto) {
    return this.createAdjustmentUseCase.execute(dto);
  }

  @Patch(':id/confirm')
  @RequirePermission('inventory.adjustments.confirm')
  confirm(@Param('id') id: string, @CurrentUser('companyId') companyId: string) {
    return this.confirmAdjustmentUseCase.execute(id, companyId);
  }
}