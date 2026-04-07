import { Controller, Get, Post, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard } from '@org/core';
import type { ILotNumberRepository } from '../../domain/repositories/lot-number.repository.interface';
import { LOT_NUMBER_REPOSITORY } from '../../domain/repositories/lot-number.repository.interface';
import { LotNumberEntity } from '../../domain/entities/lot-number.entity';
import { CreateLotNumberDto } from '../../application/dtos/lot-number.dto';
import { randomUUID } from 'crypto';

@ApiTags('Lot Numbers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('lot-numbers')
export class LotNumbersController {
  constructor(
    @Inject(LOT_NUMBER_REPOSITORY)
    private lotNumberRepository: ILotNumberRepository,
  ) {}

  @Get('product/:productId')
  @RequirePermission('inventory.stock.view')
  findByProduct(
    @Param('productId') productId: string,
    @Query('warehouseId') warehouseId?: string,
  ) {
    return this.lotNumberRepository.findByProduct(productId, warehouseId);
  }

  @Get('search/:lotNumber')
  @RequirePermission('inventory.stock.view')
  findByLotNumber(@Param('lotNumber') lotNumber: string) {
    return this.lotNumberRepository.findByLotNumber(lotNumber);
  }

  @Post()
  @RequirePermission('inventory.stock.edit')
  create(@Body() dto: CreateLotNumberDto) {
    const lot = LotNumberEntity.create({ id: randomUUID(), ...dto });
    return this.lotNumberRepository.create(lot);
  }
}