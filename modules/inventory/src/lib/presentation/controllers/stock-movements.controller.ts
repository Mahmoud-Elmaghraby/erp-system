import { Controller, Get, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard, CurrentUser } from '@org/core';
import type { IStockMovementRepository } from '../../domain/repositories/stock-movement.repository.interface';
import { STOCK_MOVEMENT_REPOSITORY } from '../../domain/repositories/stock-movement.repository.interface';

@ApiTags('Stock Movements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('stock-movements')
export class StockMovementsController {
  constructor(
    @Inject(STOCK_MOVEMENT_REPOSITORY)
    private stockMovementRepository: IStockMovementRepository,
  ) {}

  @Get()
  @RequirePermission('inventory.stock.view')
  findAll(
    @CurrentUser('companyId') companyId: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('productId') productId?: string,
    @Query('type') type?: string,
  ) {
    return this.stockMovementRepository.findAll({ companyId, warehouseId, productId, type });
  }

  @Get('warehouse/:warehouseId')
  @RequirePermission('inventory.stock.view')
  findByWarehouse(@Param('warehouseId') warehouseId: string) {
    return this.stockMovementRepository.findByWarehouse(warehouseId);
  }

  @Get('product/:productId')
  @RequirePermission('inventory.stock.view')
  findByProduct(@Param('productId') productId: string) {
    return this.stockMovementRepository.findByProduct(productId);
  }
}