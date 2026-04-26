import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Inject, UseGuards, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard, CurrentUser } from '@org/core';
import { CreatePriceListDto, UpdatePriceListDto, AddPriceListItemDto } from '../../application/dtos/price-list.dto';
import type { IPriceListRepository } from '../../domain/repositories/price-list.repository.interface';
import { PRICE_LIST_REPOSITORY } from '../../domain/repositories/price-list.repository.interface';
import { CreatePriceListUseCase } from '../../application/use-cases/price-lists/create-price-list.use-case';
import { UpdatePriceListUseCase } from '../../application/use-cases/price-lists/update-price-list.use-case';
import { GetPriceListsUseCase } from '../../application/use-cases/price-lists/get-price-lists.use-case';
import { AddProductToPriceListUseCase } from '../../application/use-cases/price-lists/add-product-to-price-list.use-case';
import { RemoveProductFromPriceListUseCase } from '../../application/use-cases/price-lists/remove-product-from-price-list.use-case';
import { ImportCsvToPriceListUseCase } from '../../application/use-cases/price-lists/import-csv-to-price-list.use-case';

@ApiTags('Price Lists')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('inventory/price-lists')
export class PriceListsController {
  constructor(
    private readonly createPriceListUseCase: CreatePriceListUseCase,
    private readonly updatePriceListUseCase: UpdatePriceListUseCase,
    private readonly getPriceListsUseCase: GetPriceListsUseCase,
    private readonly addProductToPriceListUseCase: AddProductToPriceListUseCase,
    private readonly removeProductFromPriceListUseCase: RemoveProductFromPriceListUseCase,
    private readonly importCsvToPriceListUseCase: ImportCsvToPriceListUseCase,
    @Inject(PRICE_LIST_REPOSITORY)
    private readonly priceListRepository: IPriceListRepository,
  ) {}

  @Get()
  @RequirePermission('inventory.price-lists.view')
  findAll(@CurrentUser('companyId') companyId: string) {
    return this.getPriceListsUseCase.execute(companyId);
  }

  @Post()
  @RequirePermission('inventory.price-lists.create')
  create(@Body() dto: CreatePriceListDto, @CurrentUser('companyId') companyId: string) {
    return this.createPriceListUseCase.execute(dto, companyId);
  }

  @Get(':id')
  @RequirePermission('inventory.price-lists.view')
  findOne(@Param('id') id: string, @CurrentUser('companyId') companyId: string) {
    return this.priceListRepository.findById(id, companyId);
  }

  @Put(':id')
  @RequirePermission('inventory.price-lists.edit')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePriceListDto,
    @CurrentUser('companyId') companyId: string,
  ) {
    return this.updatePriceListUseCase.execute(id, dto, companyId);
  }

  @Delete(':id')
  @RequirePermission('inventory.price-lists.delete')
  async remove(@Param('id') id: string, @CurrentUser('companyId') companyId: string) {
    await this.priceListRepository.delete(id, companyId);
    return { success: true };
  }

  @Get(':id/items')
  @RequirePermission('inventory.price-lists.view')
  getItems(@Param('id') id: string) {
    return this.priceListRepository.findItemsByPriceListId(id);
  }

  @Post(':id/items')
  @RequirePermission('inventory.price-lists.edit')
  addItem(
    @Param('id') id: string,
    @Body() dto: AddPriceListItemDto,
    @CurrentUser('companyId') companyId: string,
  ) {
    return this.addProductToPriceListUseCase.execute(id, dto, companyId);
  }

  @Delete(':id/items/:productId')
  @RequirePermission('inventory.price-lists.edit')
  removeItem(@Param('id') id: string, @Param('productId') productId: string) {
    return this.removeProductFromPriceListUseCase.execute(id, productId);
  }

  @Post(':id/import-csv')
  @RequirePermission('inventory.price-lists.edit')
  @UseInterceptors(FileInterceptor('file'))
  importCsv(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('companyId') companyId: string,
  ) {
    return this.importCsvToPriceListUseCase.execute(id, file, companyId);
  }
}
