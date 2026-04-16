
import { CategoryEntity } from '../entities/category.entity';

export interface ICategoryRepository {
  findAll(companyId: string): Promise<CategoryEntity[]>;
  findById(id: string, companyId: string): Promise<CategoryEntity | null>;
  create(category: CategoryEntity): Promise<CategoryEntity>;
  delete(id: string, companyId: string): Promise<void>;
}

export const CATEGORY_REPOSITORY = 'CATEGORY_REPOSITORY';

