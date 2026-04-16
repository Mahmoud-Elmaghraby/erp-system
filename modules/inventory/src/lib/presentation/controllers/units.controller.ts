import { Controller, Get, Post, Delete, Body, Param, UseGuards, Inject, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard, CurrentUser } from '@org/core';
import { CreateUnitUseCase } from '../../application/use-cases/units/create-unit.use-case';
import type { IUnitRepository } from '../../domain/repositories/unit.repository.interface';
import { UNIT_REPOSITORY } from '../../domain/repositories/unit.repository.interface';
import { CreateUnitDto, UpdateUnitDto } from '../../application/dtos/unit.dto';

@ApiTags('Units')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('units')
export class UnitsController {
  constructor(
    private createUnitUseCase: CreateUnitUseCase,
    @Inject(UNIT_REPOSITORY)
    private unitRepository: IUnitRepository,
  ) {}

  @Get()
  @RequirePermission('inventory.units.view')
  findAll(@CurrentUser('companyId') companyId: string) {
    return this.unitRepository.findAll(companyId);
  }

  @Post()
  @RequirePermission('inventory.units.create')
  create(@Body() dto: CreateUnitDto, @CurrentUser('companyId') companyId: string) {
    return this.createUnitUseCase.execute(dto, companyId);
  }
@Patch(':id')
@RequirePermission('inventory.units.edit')
update(@Param('id') id: string, @Body() dto: UpdateUnitDto) {
  return this.unitRepository.update(id, dto);
}
  @Delete(':id')
  @RequirePermission('inventory.units.delete')
  remove(@Param('id') id: string) {
    return this.unitRepository.delete(id);
  }
}