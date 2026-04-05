import { Inject, Injectable } from '@nestjs/common';
import type { ICategoryRepository } from '../../../domain/repositories/category.repository.interface';
import { CATEGORY_REPOSITORY } from '../../../domain/repositories/category.repository.interface';
import { CategoryEntity } from '../../../domain/entities/category.entity';
import { CreateCategoryDto } from '../../dtos/category.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private categoryRepository: ICategoryRepository,
  ) {}

  async execute(dto: CreateCategoryDto): Promise<CategoryEntity> {
    const category = CategoryEntity.create({ id: randomUUID(), ...dto });
    return this.categoryRepository.create(category);
  }
}