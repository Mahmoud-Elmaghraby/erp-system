import { ProductEntity } from '../entities/product.entity';

export interface IProductRepository {

  findAll(companyId: string): Promise<ProductEntity[]>;

  findById(id: string): Promise<ProductEntity | null>;

  findByBarcode(barcode: string, companyId: string): Promise<ProductEntity | null>;

  findBySku(sku: string, companyId: string): Promise<ProductEntity | null>;

  create(product: ProductEntity): Promise<ProductEntity>;

  save(product: ProductEntity): Promise<ProductEntity>;

  delete(id: string): Promise<void>;
}

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';