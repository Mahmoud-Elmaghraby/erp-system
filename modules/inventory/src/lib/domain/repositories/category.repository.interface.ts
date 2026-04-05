import { CategoryEntity } from '../entities/category.entity';

export interface ICategoryRepository {
  findAll(): Promise<CategoryEntity[]>;
  findById(id: string): Promise<CategoryEntity | null>;
  create(category: CategoryEntity): Promise<CategoryEntity>;
  delete(id: string): Promise<void>;
}

export const CATEGORY_REPOSITORY = 'CATEGORY_REPOSITORY';