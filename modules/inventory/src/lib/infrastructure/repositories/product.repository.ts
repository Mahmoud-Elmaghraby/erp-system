import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { ProductEntity } from '../../domain/entities/product.entity';
import { Money } from '../../domain/value-objects/money.vo';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({ where: { isActive: true } });
    return products.map(this.toEntity);
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    return product ? this.toEntity(product) : null;
  }

  async findByBarcode(barcode: string): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findUnique({ where: { barcode } });
    return product ? this.toEntity(product) : null;
  }

  async create(entity: ProductEntity): Promise<ProductEntity> {
    const product = await this.prisma.product.create({
      data: {
        id: entity.id,
        name: entity.name,
        description: entity.description,
        barcode: entity.barcode,
        sku: entity.sku,
        price: entity.price.getAmount(),
        cost: entity.cost.getAmount(),
        categoryId: entity.categoryId,
        unitOfMeasureId: entity.unitOfMeasureId,
        isActive: entity.isActive,
      },
    });
    return this.toEntity(product);
  }

  async update(id: string, data: Partial<ProductEntity>): Promise<ProductEntity> {
    const product = await this.prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price?.getAmount(),
        cost: data.cost?.getAmount(),
        categoryId: data.categoryId,
        isActive: data.isActive,
      },
    });
    return this.toEntity(product);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.update({ where: { id }, data: { isActive: false } });
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
      product.categoryId,
      product.unitOfMeasureId,
      product.isActive,
    );
  }
}