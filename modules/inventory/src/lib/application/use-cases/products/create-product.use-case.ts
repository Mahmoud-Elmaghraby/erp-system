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

    if (dto.barcode) {
      const existing = await this.productRepository.findByBarcode(dto.barcode, companyId);

      if (existing) {
        throw new Error('Product with this barcode already exists');
      }
    }

    const product = ProductEntity.create({
      id: randomUUID(),
      ...dto,
      companyId,
    });

    return this.productRepository.create(product);
  }
}