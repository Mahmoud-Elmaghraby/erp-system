import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard, CurrentUser } from '@org/core';
import { StockValuationService } from '../../application/services/stock-valuation.service';

@ApiTags('Stock Valuation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('stock-valuation')
export class StockValuationController {
  constructor(private stockValuationService: StockValuationService) {}

  @Get()
  @RequirePermission('inventory.stock.view')
  getStockValue(
    @CurrentUser('companyId') companyId: string,
    @Query('warehouseId') warehouseId?: string,
  ) {
    return this.stockValuationService.getStockValue(companyId, warehouseId);
  }
}