import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

    product.updatePrice(Money.create(dto.price));
    product.updateCost(Money.create(dto.cost));
    product.updateLowestPrice(Money.create(dto.lowestPrice));

    // Validate: price >= cost and price >= lowestPrice
    const price = product.price.getAmount();
    const cost = product.cost.getAmount();
    const lowestPrice = product.lowestPrice.getAmount();

    if (price < cost) {
      throw new BadRequestException('سعر البيع يجب أن يكون أكبر من أو يساوي تكلفة المنتج');
    }

    if (price < lowestPrice) {
      throw new BadRequestException('سعر البيع يجب أن يكون أكبر من أو يساوي أقل سعر للبيع');
    }

    return this.productRepository.save(product);
  }
}