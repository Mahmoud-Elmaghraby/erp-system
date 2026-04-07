import type { ProductVariantEntity } from '../entities/product-variant.entity';

export interface IProductVariantRepository {
  findByProduct(productId: string): Promise<ProductVariantEntity[]>;
  findById(id: string): Promise<ProductVariantEntity | null>;
  create(variant: ProductVariantEntity): Promise<ProductVariantEntity>;
  update(id: string, data: Partial<ProductVariantEntity>): Promise<ProductVariantEntity>;
  delete(id: string): Promise<void>;
}

export const PRODUCT_VARIANT_REPOSITORY = 'PRODUCT_VARIANT_REPOSITORY';