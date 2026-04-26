import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IPriceListRepository } from '../../../domain/repositories/price-list.repository.interface';
import { PRICE_LIST_REPOSITORY } from '../../../domain/repositories/price-list.repository.interface';
import type { IProductRepository } from '../../../domain/repositories/product.repository.interface';
import { PRODUCT_REPOSITORY } from '../../../domain/repositories/product.repository.interface';
import { AddPriceListItemDto } from '../../dtos/price-list.dto';

@Injectable()
export class AddProductToPriceListUseCase {
  constructor(
    @Inject(PRICE_LIST_REPOSITORY)
    private readonly priceListRepository: IPriceListRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(priceListId: string, dto: AddPriceListItemDto, companyId: string): Promise<{ success: true }> {
    const product = await this.productRepository.findById(dto.productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const defaultPrice = product.price.getAmount();

    await this.priceListRepository.addItemToPriceList(
      priceListId,
      dto.productId,
      dto.customPrice,
      defaultPrice,
    );

    return { success: true };
  }
}
