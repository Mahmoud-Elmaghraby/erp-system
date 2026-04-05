import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard } from '@org/core';
import { CreateProductUseCase } from '../../application/use-cases/products/create-product.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/products/update-product.use-case';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface';import { CreateProductDto, UpdateProductDto } from '../../application/dtos/product.dto';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('products')
export class ProductsController {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private updateProductUseCase: UpdateProductUseCase,
    @Inject(PRODUCT_REPOSITORY)
    private productRepository: IProductRepository,
  ) {}

  @Get()
  @RequirePermission('inventory.products.view')
  findAll() {
    return this.productRepository.findAll();
  }

  @Get(':id')
  @RequirePermission('inventory.products.view')
  findOne(@Param('id') id: string) {
    return this.productRepository.findById(id);
  }

  @Post()
  @RequirePermission('inventory.products.create')
  create(@Body() dto: CreateProductDto) {
    return this.createProductUseCase.execute(dto);
  }

  @Patch(':id')
  @RequirePermission('inventory.products.edit')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.updateProductUseCase.execute(id, dto);
  }

  @Delete(':id')
  @RequirePermission('inventory.products.delete')
  remove(@Param('id') id: string) {
    return this.productRepository.delete(id);
  }
}