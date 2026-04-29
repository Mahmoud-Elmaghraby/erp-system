import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard, CurrentUser } from '@org/core';
import { CreateProductUseCase } from '../../application/use-cases/products/create-product.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/products/update-product.use-case';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface';
import { CreateProductDto, UpdateProductDto } from '../../application/dtos/product.dto';
import { ProductEntity } from '../../domain/entities/product.entity';
import { Money } from '../../domain/value-objects/money.vo';
import { PrismaService } from '@org/core';
import { randomUUID } from 'crypto';

const serializeProduct = (product: ProductEntity, categoryData?: any) => ({
  id: product.id,
  name: product.name,
  description: product.description,
  barcode: product.barcode,
  sku: product.sku,
  price: product.price.getAmount(),
  currency: product.price.getCurrency(),
  cost: product.cost.getAmount(),
  lowestPrice: product.lowestPrice.getAmount(),
  categoryId: product.categoryId,
  category: categoryData,
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
    const products = await this.prisma.product.findMany({
      where: { isActive: true, companyId },
      include: { category: true },
    });
    return products.map((p) => serializeProduct(
      this.toEntity(p),
      p.category ? { id: p.category.id, name: p.category.name } : null,
    ));
  }

  @Get(':id')
  @RequirePermission('inventory.products.view')
  async findOne(@Param('id') id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) return null;
    return serializeProduct(
      this.toEntity(product),
      product.category ? { id: product.category.id, name: product.category.name } : null,
    );
  }

  @Post()
  @RequirePermission('inventory.products.create')
  async create(@Body() dto: CreateProductDto, @CurrentUser('companyId') companyId: string) {
    const product = await this.createProductUseCase.execute(dto, companyId);
    const categoryData = dto.categoryId ? await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
      select: { id: true, name: true },
    }) : null;
    return serializeProduct(product, categoryData);
  }

  @Patch(':id')
  @RequirePermission('inventory.products.edit')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    const product = await this.updateProductUseCase.execute(id, dto);
    const categoryId = product.categoryId;
    const categoryData = categoryId ? await this.prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true, name: true },
    }) : null;
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
    return serializeProduct(product, categoryData);
  }

  @Delete(':id')
  @RequirePermission('inventory.products.delete')
  remove(@Param('id') id: string) {
    return this.productRepository.delete(id);
  }

  private toEntity(product: any): ProductEntity {
    return new ProductEntity(
      product.id,
      product.name,
      product.description,
      product.barcode,
      product.sku,
      Money.create(Number(product.price)),
      Money.create(Number(product.cost)),
      Money.create(Number(product.lowestPrice ?? 0)),
      product.categoryId,
      product.unitOfMeasureId,
      product.isActive,
      product.companyId,
      product.itemCode ?? null,
      product.itemType ?? null,
      product.unitType ?? null,
    );
  }
}