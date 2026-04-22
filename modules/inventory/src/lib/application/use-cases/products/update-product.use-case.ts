import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IProductRepository } from '../../../domain/repositories/product.repository.interface';
import { PRODUCT_REPOSITORY } from '../../../domain/repositories/product.repository.interface';
import { Money } from '../../../domain/value-objects/money.vo';
import { UpdateProductDto } from '../../dtos/product.dto';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string, dto: UpdateProductDto) {

    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.updateDetails({
      name: dto.name,
      description: dto.description,
      barcode: dto.barcode,
      sku: dto.sku,
      categoryId: dto.categoryId,
      unitOfMeasureId: dto.unitOfMeasureId,
    });

    if (dto.price !== undefined) {
      product.updatePrice(Money.create(dto.price));
    }

    if (dto.cost !== undefined) {
      product.updateCost(Money.create(dto.cost));
    }

    return this.productRepository.save(product);
  }
}