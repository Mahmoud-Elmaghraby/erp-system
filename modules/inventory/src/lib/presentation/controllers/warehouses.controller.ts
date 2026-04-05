import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard } from '@org/core';
import { CreateWarehouseUseCase } from '../../application/use-cases/warehouses/create-warehouse.use-case';
import type { IWarehouseRepository } from '../../domain/repositories/warehouse.repository.interface';
import { WAREHOUSE_REPOSITORY } from '../../domain/repositories/warehouse.repository.interface';
import { CreateWarehouseDto, UpdateWarehouseDto } from '../../application/dtos/warehouse.dto';
import { Inject } from '@nestjs/common';

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
  findAll() {
    return this.warehouseRepository.findAll('');
  }

  @Get('branch/:branchId')
  @RequirePermission('inventory.warehouses.view')
  findByBranch(@Param('branchId') branchId: string) {
    return this.warehouseRepository.findAll(branchId);
  }

  @Get(':id')
  @RequirePermission('inventory.warehouses.view')
  findOne(@Param('id') id: string) {
    return this.warehouseRepository.findById(id);
  }

  @Post()
  @RequirePermission('inventory.warehouses.create')
  create(@Body() dto: CreateWarehouseDto) {
    return this.createWarehouseUseCase.execute(dto);
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