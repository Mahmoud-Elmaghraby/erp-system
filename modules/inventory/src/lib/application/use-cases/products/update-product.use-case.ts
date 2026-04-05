import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IProductRepository } from '../../../domain/repositories/product.repository.interface';
import { PRODUCT_REPOSITORY } from '../../../domain/repositories/product.repository.interface';
import { Money } from '../../../domain/value-objects/money.vo';
import { UpdateProductDto } from '../../dtos/product.dto';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private productRepository: IProductRepository,
  ) {}

  async execute(id: string, dto: UpdateProductDto) {
    const product = await this.productRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');

    return this.productRepository.update(id, {
      name: dto.name,
      description: dto.description,
      price: dto.price !== undefined ? Money.create(dto.price) : undefined,
      cost: dto.cost !== undefined ? Money.create(dto.cost) : undefined,
      categoryId: dto.categoryId,
    });
  }
}