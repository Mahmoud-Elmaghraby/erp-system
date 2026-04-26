import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { IPriceListRepository } from '../../../domain/repositories/price-list.repository.interface';
import { PRICE_LIST_REPOSITORY } from '../../../domain/repositories/price-list.repository.interface';
import { PriceListEntity } from '../../../domain/entities/price-list.entity';
import { CreatePriceListDto } from '../../dtos/price-list.dto';

@Injectable()
export class CreatePriceListUseCase {
  constructor(
    @Inject(PRICE_LIST_REPOSITORY)
    private readonly priceListRepository: IPriceListRepository,
  ) {}

  async execute(dto: CreatePriceListDto, companyId: string): Promise<PriceListEntity> {
    const entity = PriceListEntity.create({
      id: randomUUID(),
      companyId,
      name: dto.name,
      status: dto.status,
    });

    return this.priceListRepository.create(entity);
  }
}
