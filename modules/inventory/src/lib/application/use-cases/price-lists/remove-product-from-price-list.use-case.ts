import { Injectable, Inject } from '@nestjs/common';
import type { IPriceListRepository } from '../../../domain/repositories/price-list.repository.interface';
import { PRICE_LIST_REPOSITORY } from '../../../domain/repositories/price-list.repository.interface';

@Injectable()
export class RemoveProductFromPriceListUseCase {
  constructor(
    @Inject(PRICE_LIST_REPOSITORY)
    private readonly priceListRepository: IPriceListRepository,
  ) {}

  async execute(priceListId: string, productId: string): Promise<{ success: true }> {
    await this.priceListRepository.removeItemFromPriceList(priceListId, productId);
    return { success: true };
  }
}
