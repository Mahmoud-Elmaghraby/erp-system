import { ProductEntity } from '../entities/product.entity';

export interface IProductRepository {
  findAll(): Promise<ProductEntity[]>;
  findById(id: string): Promise<ProductEntity | null>;
  findByBarcode(barcode: string): Promise<ProductEntity | null>;
  create(product: ProductEntity): Promise<ProductEntity>;
  update(id: string, data: Partial<ProductEntity>): Promise<ProductEntity>;
  delete(id: string): Promise<void>;
}

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';