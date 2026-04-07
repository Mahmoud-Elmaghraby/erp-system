import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard } from '@org/core';
import { StockValuationService } from '../../application/services/stock-valuation.service';

@ApiTags('Stock Valuation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('stock-valuation')
export class StockValuationController {
  constructor(private stockValuationService: StockValuationService) {}

  @Get()
  @RequirePermission('inventory.stock.view')
  getStockValue(@Query('warehouseId') warehouseId?: string) {
    return this.stockValuationService.getStockValue(warehouseId);
  }
}