

import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { CATEGORY_REPOSITORY } from '../../../domain/repositories/category.repository.interface';
import type { ICategoryRepository } from '../../../domain/repositories/category.repository.interface';

import { CategoryEntity } from '../../../domain/entities/category.entity';
import { CreateCategoryDto } from '../../dtos/category.dto';


@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private repository: ICategoryRepository,
  ) {}

  async execute(dto: CreateCategoryDto, companyId: string) {
    const category = CategoryEntity.create({
      id: randomUUID(),
      name: dto.name,
      parentId: dto.parentId,
      companyId,
    });

    return this.repository.create(category);
  }
}

