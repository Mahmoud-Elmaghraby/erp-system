import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { ProductEntity } from '../../domain/entities/product.entity';
import { Money } from '../../domain/value-objects/money.vo';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({
      where: { isActive: true, companyId },
    });
    return products.map((p) => this.toEntity(p));
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    return product ? this.toEntity(product) : null;
  }

  async findByBarcode(barcode: string, companyId: string): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findFirst({
      where: { barcode, companyId },
    });
    return product ? this.toEntity(product) : null;
  }

  async findBySku(sku: string, companyId: string): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findFirst({
      where: { sku, companyId },
    });
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
        companyId: entity.companyId,
        itemCode: entity.itemCode,
        itemType: entity.itemType,
        unitType: entity.unitType,
      },
    });
    return this.toEntity(product);
  }

  async save(entity: ProductEntity): Promise<ProductEntity> {
    const product = await this.prisma.product.update({
      where: { id: entity.id },
      data: {
        name: entity.name,
        description: entity.description,
        barcode: entity.barcode,
        sku: entity.sku,
        price: entity.price.getAmount(),
        cost: entity.cost.getAmount(),
        categoryId: entity.categoryId,
        unitOfMeasureId: entity.unitOfMeasureId,
        isActive: entity.isActive,
        itemCode: entity.itemCode,
        itemType: entity.itemType,
        unitType: entity.unitType,
      },
    });
    return this.toEntity(product);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
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
      product.companyId,
      product.itemCode ?? null,
      product.itemType ?? null,
      product.unitType ?? null,
    );
  }
}