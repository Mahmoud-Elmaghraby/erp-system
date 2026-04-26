import { Injectable, Inject } from '@nestjs/common';
import type { IPriceListRepository } from '../../../domain/repositories/price-list.repository.interface';
import { PRICE_LIST_REPOSITORY } from '../../../domain/repositories/price-list.repository.interface';
import { PriceListEntity } from '../../../domain/entities/price-list.entity';

@Injectable()
export class GetPriceListsUseCase {
  constructor(
    @Inject(PRICE_LIST_REPOSITORY)
    private readonly priceListRepository: IPriceListRepository,
  ) {}

  async execute(companyId: string): Promise<PriceListEntity[]> {
    return this.priceListRepository.findAll(companyId);
  }
}
