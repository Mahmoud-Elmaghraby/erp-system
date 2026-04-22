import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard } from '@org/core';
import type { ISerialNumberRepository } from '../../domain/repositories/serial-number.repository.interface';
import { SERIAL_NUMBER_REPOSITORY } from '../../domain/repositories/serial-number.repository.interface';
import { SerialNumberEntity } from '../../domain/entities/serial-number.entity';
import { CreateSerialNumbersDto, UpdateSerialNumberStatusDto } from '../../application/dtos/serial-number.dto';
import { randomUUID } from 'crypto';

@ApiTags('Serial Numbers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('serial-numbers')
export class SerialNumbersController {
  constructor(
    @Inject(SERIAL_NUMBER_REPOSITORY)
    private serialNumberRepository: ISerialNumberRepository,
  ) {}

  @Get('product/:productId')
  @RequirePermission('inventory.stock.view')
  findByProduct(
    @Param('productId') productId: string,
    @Query('warehouseId') warehouseId?: string,
  ) {
    return this.serialNumberRepository.findByProduct(productId, warehouseId);
  }

  @Get('search/:serialNumber')
  @RequirePermission('inventory.stock.view')
  findBySerialNumber(@Param('serialNumber') serialNumber: string) {
    return this.serialNumberRepository.findBySerialNumber(serialNumber);
  }

  @Post()
  @RequirePermission('inventory.stock.edit')
  createMany(@Body() dto: CreateSerialNumbersDto) {
    const entities = dto.serialNumbers.map(sn =>
      SerialNumberEntity.create({
        id: randomUUID(),
        serialNumber: sn,
        productId: dto.productId,
        warehouseId: dto.warehouseId,
        notes: dto.notes,
      })
    );
    return this.serialNumberRepository.createMany(entities);
  }

  @Patch(':id/status')
  @RequirePermission('inventory.stock.edit')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateSerialNumberStatusDto) {
    return this.serialNumberRepository.updateStatus(id, dto.status);
  }
}