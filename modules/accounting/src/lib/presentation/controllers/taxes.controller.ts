import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard } from '@org/core';
import type { ITaxRepository } from '../../domain/repositories/tax.repository.interface';
import { TAX_REPOSITORY } from '../../domain/repositories/tax.repository.interface';
import { TaxEntity } from '../../domain/entities/tax.entity';
import { CreateTaxDto, UpdateTaxDto } from '../../application/dtos/tax.dto';
import { randomUUID } from 'crypto';

@ApiTags('Taxes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('taxes')
export class TaxesController {
  constructor(
    @Inject(TAX_REPOSITORY)
    private taxRepository: ITaxRepository,
  ) {}

  @Get()
  @RequirePermission('accounting.taxes.view')
  findAll(@Query('companyId') companyId: string, @Query('scope') scope?: string) {
    if (scope) return this.taxRepository.findByScope(companyId, scope);
    return this.taxRepository.findAll(companyId);
  }

  @Get(':id')
  @RequirePermission('accounting.taxes.view')
  findOne(@Param('id') id: string) {
    return this.taxRepository.findById(id);
  }

  @Post()
  @RequirePermission('accounting.taxes.create')
  create(@Body() dto: CreateTaxDto) {
    const tax = TaxEntity.create({ id: randomUUID(), ...dto });
    return this.taxRepository.create(tax);
  }

  @Patch(':id')
  @RequirePermission('accounting.taxes.edit')
  update(@Param('id') id: string, @Body() dto: UpdateTaxDto) {
    return this.taxRepository.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('accounting.taxes.delete')
  remove(@Param('id') id: string) {
    return this.taxRepository.delete(id);
  }
}