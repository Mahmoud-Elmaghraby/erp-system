import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard } from '@org/core';
import { CreateSupplierUseCase } from '../../application/use-cases/suppliers/create-supplier.use-case';
import type { ISupplierRepository } from '../../domain/repositories/supplier.repository.interface';
import { SUPPLIER_REPOSITORY } from '../../domain/repositories/supplier.repository.interface';
import { CreateSupplierDto, UpdateSupplierDto } from '../../application/dtos/supplier.dto';

@ApiTags('Suppliers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('suppliers')
export class SuppliersController {
  constructor(
    private createSupplierUseCase: CreateSupplierUseCase,
    @Inject(SUPPLIER_REPOSITORY)
    private supplierRepository: ISupplierRepository,
  ) {}

  @Get()
  @RequirePermission('purchasing.suppliers.view')
  findAll() { return this.supplierRepository.findAll(); }

  @Get(':id')
  @RequirePermission('purchasing.suppliers.view')
  findOne(@Param('id') id: string) { return this.supplierRepository.findById(id); }

  @Post()
  @RequirePermission('purchasing.suppliers.create')
  create(@Body() dto: CreateSupplierDto) { return this.createSupplierUseCase.execute(dto); }

  @Patch(':id')
  @RequirePermission('purchasing.suppliers.edit')
  update(@Param('id') id: string, @Body() dto: UpdateSupplierDto) {
    return this.supplierRepository.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('purchasing.suppliers.delete')
  remove(@Param('id') id: string) { return this.supplierRepository.delete(id); }
}