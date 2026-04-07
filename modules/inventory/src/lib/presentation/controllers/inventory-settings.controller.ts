import { Controller, Get, Put, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard } from '@org/core';
import type { IInventorySettingsRepository } from '../../domain/repositories/inventory-settings.repository.interface';
import { INVENTORY_SETTINGS_REPOSITORY } from '../../domain/repositories/inventory-settings.repository.interface';
import { InventorySettingsEntity } from '../../domain/entities/inventory-settings.entity';
import { UpdateInventorySettingsDto } from '../../application/dtos/inventory-settings.dto';
import { randomUUID } from 'crypto';

@ApiTags('Inventory Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('inventory-settings')
export class InventorySettingsController {
  constructor(
    @Inject(INVENTORY_SETTINGS_REPOSITORY)
    private settingsRepository: IInventorySettingsRepository,
  ) {}

  @Get(':companyId')
  @RequirePermission('inventory.settings.view')
  async getSettings(@Param('companyId') companyId: string) {
    const settings = await this.settingsRepository.findByCompany(companyId);
    if (!settings) {
      return InventorySettingsEntity.create({ id: randomUUID(), companyId });
    }
    return settings;
  }

  @Put(':companyId')
  @RequirePermission('inventory.settings.edit')
  async updateSettings(
    @Param('companyId') companyId: string,
    @Body() dto: UpdateInventorySettingsDto,
  ) {
    let settings = await this.settingsRepository.findByCompany(companyId);
    if (!settings) {
      settings = InventorySettingsEntity.create({ id: randomUUID(), companyId });
    }
    settings.update(dto);
    return this.settingsRepository.upsert(settings);
  }
}