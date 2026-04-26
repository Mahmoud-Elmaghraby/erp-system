import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IPriceListRepository } from '../../../domain/repositories/price-list.repository.interface';
import { PRICE_LIST_REPOSITORY } from '../../../domain/repositories/price-list.repository.interface';
import { PriceListEntity } from '../../../domain/entities/price-list.entity';
import { UpdatePriceListDto } from '../../dtos/price-list.dto';

@Injectable()
export class UpdatePriceListUseCase {
  constructor(
    @Inject(PRICE_LIST_REPOSITORY)
    private readonly priceListRepository: IPriceListRepository,
  ) {}

  async execute(id: string, dto: UpdatePriceListDto, companyId: string): Promise<PriceListEntity> {
    const existing = await this.priceListRepository.findById(id, companyId);
    if (!existing) {
      throw new NotFoundException('Price list not found');
    }

    return this.priceListRepository.update(id, companyId, {
      name: dto.name,
      status: dto.status,
    });
  }
}
