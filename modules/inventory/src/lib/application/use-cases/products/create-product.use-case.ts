import { Inject, Injectable } from '@nestjs/common';
import type { IProductRepository } from '../../../domain/repositories/product.repository.interface';
import { PRODUCT_REPOSITORY } from '../../../domain/repositories/product.repository.interface';
import { ProductEntity } from '../../../domain/entities/product.entity';
import { CreateProductDto } from '../../dtos/product.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(dto: CreateProductDto, companyId: string): Promise<ProductEntity> {
    // Auto-generate barcode if not provided
    if (!dto.barcode) {
      dto.barcode = this.generateBarcode();
    }

    // Auto-generate SKU if not provided
    if (!dto.sku) {
      dto.sku = this.generateSku();
    }

    const existing = await this.productRepository.findByBarcode(dto.barcode, companyId);
    if (existing) {
      throw new Error('Product with this barcode already exists');
    }

    // Check for duplicate name and category
    const duplicateNameCategory = await this.productRepository.findByNameAndCategory(
      dto.name,
      dto.categoryId ?? null,
      companyId,
    );
    if (duplicateNameCategory) {
      throw new Error('Product with this name and category already exists');
    }

    const product = ProductEntity.create({
      id: randomUUID(),
      ...dto,
      companyId,
    });

    return this.productRepository.create(product);
  }

  /**
   * Generates a 13-digit EAN-style barcode
   */
  private generateBarcode(): string {
    const timestamp = Date.now().toString().slice(-10);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return timestamp + random;
  }

  /**
   * Generates an SKU with format: SKU-XXXXXXXX (8 random alphanumeric uppercase chars)
   */
  private generateSku(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'SKU-';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}