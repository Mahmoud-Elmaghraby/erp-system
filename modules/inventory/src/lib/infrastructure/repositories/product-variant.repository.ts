import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { IProductVariantRepository } from '../../domain/repositories/product-variant.repository.interface';
import { ProductVariantEntity } from '../../domain/entities/product-variant.entity';

@Injectable()
export class ProductVariantRepository implements IProductVariantRepository {
  constructor(private prisma: PrismaService) {}

  async findByProduct(productId: string): Promise<ProductVariantEntity[]> {
    const variants = await this.prisma.productVariant.findMany({
      where: { productId, isActive: true },
    });
    return variants.map(this.toEntity);
  }

  async findById(id: string): Promise<ProductVariantEntity | null> {
    const variant = await this.prisma.productVariant.findUnique({ where: { id } });
    return variant ? this.toEntity(variant) : null;
  }

  async create(entity: ProductVariantEntity): Promise<ProductVariantEntity> {
    const variant = await this.prisma.productVariant.create({
      data: {
        id: entity.id,
        productId: entity.productId,
        companyId: entity.companyId,
        name: entity.name,
        sku: entity.sku,
        barcode: entity.barcode,
        price: entity.price,
        cost: entity.cost,
        attributes: entity.attributes,
        isActive: entity.isActive,
      },
    });
    return this.toEntity(variant);
  }

  async update(id: string, data: Partial<ProductVariantEntity>): Promise<ProductVariantEntity> {
    const variant = await this.prisma.productVariant.update({
      where: { id },
      data: {
        name: data.name,
        sku: data.sku,
        barcode: data.barcode,
        price: data.price,
        cost: data.cost,
        attributes: data.attributes as any,
      },
    });
    return this.toEntity(variant);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.productVariant.update({ where: { id }, data: { isActive: false } });
  }

  private toEntity(v: any): ProductVariantEntity {
    return new ProductVariantEntity(
      v.id, v.productId, v.companyId, v.name,
      v.sku, v.barcode, Number(v.price), Number(v.cost),
      v.attributes as Record<string, string>, v.isActive,
    );
  }
}