import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard, CurrentUser } from '@org/core';
import { CreateProductUseCase } from '../../application/use-cases/products/create-product.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/products/update-product.use-case';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface';
import { CreateProductDto, UpdateProductDto } from '../../application/dtos/product.dto';
import { ProductEntity } from '../../domain/entities/product.entity';
import { PrismaService } from '@org/core';
import { randomUUID } from 'crypto';

const serializeProduct = (product: ProductEntity) => ({
  id: product.id,
  name: product.name,
  description: product.description,
  barcode: product.barcode,
  sku: product.sku,
  price: product.price.getAmount(),
  currency: product.price.getCurrency(),
  cost: product.cost.getAmount(),
  categoryId: product.categoryId,
  unitOfMeasureId: product.unitOfMeasureId,
  isActive: product.isActive,
  companyId: product.companyId,
});

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('products')
export class ProductsController {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private updateProductUseCase: UpdateProductUseCase,
    private prisma: PrismaService,
    @Inject(PRODUCT_REPOSITORY)
    private productRepository: IProductRepository,
  ) {}

  @Get()
  @RequirePermission('inventory.products.view')
  async findAll(@CurrentUser('companyId') companyId: string) {
    const products = await this.productRepository.findAll(companyId);
    return products.map(serializeProduct);
  }

  @Get(':id')
  @RequirePermission('inventory.products.view')
  async findOne(@Param('id') id: string) {
    const product = await this.productRepository.findById(id);
    return product ? serializeProduct(product) : null;
  }

  @Post()
  @RequirePermission('inventory.products.create')
  async create(@Body() dto: CreateProductDto, @CurrentUser('companyId') companyId: string) {
    const product = await this.createProductUseCase.execute(dto, companyId);
    return serializeProduct(product);
  }

  @Patch(':id')
  @RequirePermission('inventory.products.edit')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    const product = await this.updateProductUseCase.execute(id, dto);
    if (dto.price !== undefined || dto.cost !== undefined) {
      await this.prisma.productPriceHistory.create({
        data: {
          id: randomUUID(),
          productId: id,
          price: product.price.getAmount(),
          cost: product.cost.getAmount(),
        },
      });
    }
    return serializeProduct(product);
  }

  @Delete(':id')
  @RequirePermission('inventory.products.delete')
  remove(@Param('id') id: string) {
    return this.productRepository.delete(id);
  }
}