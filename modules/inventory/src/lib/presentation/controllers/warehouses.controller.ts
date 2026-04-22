import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard, CurrentUser } from '@org/core';
import { CreateWarehouseUseCase } from '../../application/use-cases/warehouses/create-warehouse.use-case';
import type { IWarehouseRepository } from '../../domain/repositories/warehouse.repository.interface';
import { WAREHOUSE_REPOSITORY } from '../../domain/repositories/warehouse.repository.interface';
import { CreateWarehouseDto, UpdateWarehouseDto } from '../../application/dtos/warehouse.dto';

@ApiTags('Warehouses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('warehouses')
export class WarehousesController {
  constructor(
    private createWarehouseUseCase: CreateWarehouseUseCase,
    @Inject(WAREHOUSE_REPOSITORY)
    private warehouseRepository: IWarehouseRepository,
  ) {}

  @Get()
  @RequirePermission('inventory.warehouses.view')
  findAll(@CurrentUser('companyId') companyId: string) {
    return this.warehouseRepository.findAll(companyId);
  }

  @Get(':id')
  @RequirePermission('inventory.warehouses.view')
  findOne(@Param('id') id: string) {
    return this.warehouseRepository.findById(id);
  }

  @Post()
  @RequirePermission('inventory.warehouses.create')
  create(@Body() dto: CreateWarehouseDto, @CurrentUser('companyId') companyId: string) {
    return this.createWarehouseUseCase.execute(dto, companyId);
  }

  @Patch(':id')
  @RequirePermission('inventory.warehouses.edit')
  update(@Param('id') id: string, @Body() dto: UpdateWarehouseDto) {
    return this.warehouseRepository.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('inventory.warehouses.delete')
  remove(@Param('id') id: string) {
    return this.warehouseRepository.delete(id);
  }
}