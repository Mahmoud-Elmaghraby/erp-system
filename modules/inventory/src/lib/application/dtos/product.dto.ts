export class CreateProductDto {
  name!: string;
  description?: string;
  barcode?: string;
  sku?: string;
  price?: number;
  cost?: number;
  categoryId?: string;
  unitOfMeasureId?: string;
}

export class UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  cost?: number;
  categoryId?: string;
}