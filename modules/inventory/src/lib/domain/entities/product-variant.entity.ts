export class ProductVariantEntity {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public name: string,
    public sku: string | null,
    public barcode: string | null,
    public price: number,
    public cost: number,
    public attributes: Record<string, string>,
    public isActive: boolean,
  ) {}

  static create(data: {
    id: string;
    productId: string;
    name: string;
    sku?: string;
    barcode?: string;
    price?: number;
    cost?: number;
    attributes?: Record<string, string>;
  }): ProductVariantEntity {
    return new ProductVariantEntity(
      data.id, data.productId, data.name,
      data.sku ?? null, data.barcode ?? null,
      data.price ?? 0, data.cost ?? 0,
      data.attributes ?? {}, true,
    );
  }
}