import { Controller, Get, Post, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard, CurrentUser } from '@org/core';
import { AddStockUseCase } from '../../application/use-cases/stock/add-stock.use-case';
import { RemoveStockUseCase } from '../../application/use-cases/stock/remove-stock.use-case';
import { TransferStockUseCase } from '../../application/use-cases/stock/transfer-stock.use-case';
import type { IStockRepository } from '../../domain/repositories/stock.repository.interface';
import { STOCK_REPOSITORY } from '../../domain/repositories/stock.repository.interface';
import { AddStockDto, RemoveStockDto, TransferStockDto } from '../../application/dtos/stock.dto';

@ApiTags('Stock')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('stock')
export class StockController {
  constructor(
    private addStockUseCase: AddStockUseCase,
    private removeStockUseCase: RemoveStockUseCase,
    private transferStockUseCase: TransferStockUseCase,
    @Inject(STOCK_REPOSITORY)
    private stockRepository: IStockRepository,
  ) {}

  @Get('warehouse/:warehouseId')
  @RequirePermission('inventory.stock.view')
  getStock(@Param('warehouseId') warehouseId: string) {
    return this.stockRepository.findByWarehouse(warehouseId);
  }

  @Post('add')
  @RequirePermission('inventory.stock.edit')
  addStock(@Body() dto: AddStockDto, @CurrentUser('companyId') companyId: string) {
    return this.addStockUseCase.execute(dto, companyId);
  }

  @Post('remove')
  @RequirePermission('inventory.stock.edit')
  removeStock(@Body() dto: RemoveStockDto, @CurrentUser('companyId') companyId: string) {
    return this.removeStockUseCase.execute(dto, companyId);
  }

  @Post('transfer')
  @RequirePermission('inventory.stock.transfer')
  transferStock(@Body() dto: TransferStockDto, @CurrentUser('companyId') companyId: string) {
    return this.transferStockUseCase.execute(dto, companyId);
  }
}