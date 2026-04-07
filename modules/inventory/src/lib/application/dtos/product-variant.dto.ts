export class CreateProductVariantDto {
  productId!: string;
  name!: string;
  sku?: string;
  barcode?: string;
  price?: number;
  cost?: number;
  attributes?: Record<string, string>;
}

export class UpdateProductVariantDto {
  name?: string;
  sku?: string;
  barcode?: string;
  price?: number;
  cost?: number;
  attributes?: Record<string, string>;
}