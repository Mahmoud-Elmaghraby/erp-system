import { Controller, Get, Post, Delete, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard } from '@org/core';
import { CreateUnitUseCase } from '../../application/use-cases/units/create-unit.use-case';
import type { IUnitRepository } from '../../domain/repositories/unit.repository.interface';
import { UNIT_REPOSITORY } from '../../domain/repositories/unit.repository.interface';
import { CreateUnitDto } from '../../application/dtos/unit.dto';

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
  findAll() {
    return this.unitRepository.findAll();
  }

  @Post()
  @RequirePermission('inventory.units.create')
  create(@Body() dto: CreateUnitDto) {
    return this.createUnitUseCase.execute(dto);
  }

  @Delete(':id')
  @RequirePermission('inventory.units.delete')
  remove(@Param('id') id: string) {
    return this.unitRepository.delete(id);
  }
}