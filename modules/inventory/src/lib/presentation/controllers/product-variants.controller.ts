import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard, CurrentUser } from '@org/core';
import type { IProductVariantRepository } from '../../domain/repositories/product-variant.repository.interface';
import { PRODUCT_VARIANT_REPOSITORY } from '../../domain/repositories/product-variant.repository.interface';
import { ProductVariantEntity } from '../../domain/entities/product-variant.entity';
import { CreateProductVariantDto, UpdateProductVariantDto } from '../../application/dtos/product-variant.dto';
import { randomUUID } from 'crypto';

@ApiTags('Product Variants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('product-variants')
export class ProductVariantsController {
  constructor(
    @Inject(PRODUCT_VARIANT_REPOSITORY)
    private variantRepository: IProductVariantRepository,
  ) {}

  @Get('product/:productId')
  @RequirePermission('inventory.products.view')
  findByProduct(@Param('productId') productId: string) {
    return this.variantRepository.findByProduct(productId);
  }

  @Post()
  @RequirePermission('inventory.products.create')
  create(@Body() dto: CreateProductVariantDto, @CurrentUser('companyId') companyId: string) {
    const variant = ProductVariantEntity.create({ id: randomUUID(), ...dto, companyId });
    return this.variantRepository.create(variant);
  }

  @Patch(':id')
  @RequirePermission('inventory.products.edit')
  update(@Param('id') id: string, @Body() dto: UpdateProductVariantDto) {
    return this.variantRepository.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('inventory.products.delete')
  delete(@Param('id') id: string) {
    return this.variantRepository.delete(id);
  }
}