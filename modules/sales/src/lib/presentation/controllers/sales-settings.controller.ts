import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  JwtAuthGuard,
  PermissionGuard,
  RequirePermission,
} from '@org/core';
import {
  BulkUpdatePriceListsDto,
  CreatePriceListDto,
  CreatePriceOfferDto,
  CreateShippingOptionDto,
  SaveOrderSourcesDto,
  UpdatePriceListDto,
  UpdatePriceOfferDto,
  UpdateShippingConfigDto,
  UpdateShippingOptionDto,
} from '../../application/dtos/sales-settings.dto';
import { SalesModuleSettingsService } from '../../application/services/sales-module-settings.service';

@ApiTags('Sales Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('settings')
export class SalesSettingsController {
  constructor(private readonly settingsService: SalesModuleSettingsService) {}

  @Get('price-lists')
  @RequirePermission('sales.settings.view')
  @ApiOperation({ summary: 'List sales price lists' })
  listPriceLists(@CurrentUser('companyId') companyId: string) {
    return this.settingsService.listPriceLists(companyId);
  }

  @Post('price-lists')
  @RequirePermission('sales.settings.edit')
  @ApiOperation({ summary: 'Create a sales price list' })
  createPriceList(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: CreatePriceListDto,
  ) {
    return this.settingsService.createPriceList(companyId, dto);
  }

  @Patch('price-lists/:id')
  @RequirePermission('sales.settings.edit')
  @ApiOperation({ summary: 'Update a sales price list' })
  updatePriceList(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePriceListDto,
  ) {
    return this.settingsService.updatePriceList(companyId, id, dto);
  }

  @Delete('price-lists/:id')
  @RequirePermission('sales.settings.edit')
  @ApiOperation({ summary: 'Delete a sales price list' })
  deletePriceList(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.settingsService.deletePriceList(companyId, id);
  }

  @Post('price-lists/bulk-update')
  @RequirePermission('sales.settings.edit')
  @ApiOperation({ summary: 'Apply bulk update for price list values' })
  applyPriceListBulkUpdate(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: BulkUpdatePriceListsDto,
  ) {
    return this.settingsService.applyPriceListBulkUpdate(companyId, dto);
  }

  @Get('order-sources')
  @RequirePermission('sales.settings.view')
  @ApiOperation({ summary: 'Get order sources and configuration' })
  getOrderSources(@CurrentUser('companyId') companyId: string) {
    return this.settingsService.getOrderSources(companyId);
  }

  @Put('order-sources')
  @RequirePermission('sales.settings.edit')
  @ApiOperation({ summary: 'Replace order sources and save configuration' })
  saveOrderSources(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: SaveOrderSourcesDto,
  ) {
    return this.settingsService.saveOrderSources(companyId, dto);
  }

  @Get('shipping')
  @RequirePermission('sales.settings.view')
  @ApiOperation({ summary: 'Get shipping settings configuration' })
  getShippingConfig(@CurrentUser('companyId') companyId: string) {
    return this.settingsService.getShippingConfig(companyId);
  }

  @Patch('shipping')
  @RequirePermission('sales.settings.edit')
  @ApiOperation({ summary: 'Update shipping settings configuration' })
  updateShippingConfig(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: UpdateShippingConfigDto,
  ) {
    return this.settingsService.updateShippingConfig(companyId, dto);
  }

  @Get('shipping/options')
  @RequirePermission('sales.settings.view')
  @ApiOperation({ summary: 'List shipping options' })
  listShippingOptions(@CurrentUser('companyId') companyId: string) {
    return this.settingsService.listShippingOptions(companyId);
  }

  @Post('shipping/options')
  @RequirePermission('sales.settings.edit')
  @ApiOperation({ summary: 'Create shipping option' })
  createShippingOption(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: CreateShippingOptionDto,
  ) {
    return this.settingsService.createShippingOption(companyId, dto);
  }

  @Patch('shipping/options/:id')
  @RequirePermission('sales.settings.edit')
  @ApiOperation({ summary: 'Update shipping option' })
  updateShippingOption(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: UpdateShippingOptionDto,
  ) {
    return this.settingsService.updateShippingOption(companyId, id, dto);
  }

  @Delete('shipping/options/:id')
  @RequirePermission('sales.settings.edit')
  @ApiOperation({ summary: 'Delete shipping option' })
  deleteShippingOption(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.settingsService.deleteShippingOption(companyId, id);
  }

  @Get('offers')
  @RequirePermission('sales.settings.view')
  @ApiOperation({ summary: 'List sales price offers' })
  listPriceOffers(@CurrentUser('companyId') companyId: string) {
    return this.settingsService.listPriceOffers(companyId);
  }

  @Post('offers')
  @RequirePermission('sales.settings.edit')
  @ApiOperation({ summary: 'Create sales price offer' })
  createPriceOffer(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: CreatePriceOfferDto,
  ) {
    return this.settingsService.createPriceOffer(companyId, dto);
  }

  @Patch('offers/:id')
  @RequirePermission('sales.settings.edit')
  @ApiOperation({ summary: 'Update sales price offer' })
  updatePriceOffer(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePriceOfferDto,
  ) {
    return this.settingsService.updatePriceOffer(companyId, id, dto);
  }

  @Delete('offers/:id')
  @RequirePermission('sales.settings.edit')
  @ApiOperation({ summary: 'Delete sales price offer' })
  deletePriceOffer(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.settingsService.deletePriceOffer(companyId, id);
  }
}
