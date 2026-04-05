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
    private productRepository: IProductRepository,
  ) {}

  async execute(dto: CreateProductDto): Promise<ProductEntity> {
    const product = ProductEntity.create({ id: randomUUID(), ...dto });
    return this.productRepository.create(product);
  }
}