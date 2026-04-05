import { Money } from '../value-objects/money.vo';

export class ProductEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string | null,
    public barcode: string | null,
    public sku: string | null,
    public price: Money,
    public cost: Money,
    public categoryId: string | null,
    public unitOfMeasureId: string | null,
    public isActive: boolean,
  ) {}

  static create(data: {
    id: string;
    name: string;
    description?: string;
    barcode?: string;
    sku?: string;
    price?: number;
    cost?: number;
    categoryId?: string;
    unitOfMeasureId?: string;
  }): ProductEntity {
    return new ProductEntity(
      data.id,
      data.name,
      data.description ?? null,
      data.barcode ?? null,
      data.sku ?? null,
      Money.create(data.price ?? 0),
      Money.create(data.cost ?? 0),
      data.categoryId ?? null,
      data.unitOfMeasureId ?? null,
      true,
    );
  }

  updatePrice(price: Money): void { this.price = price; }
  deactivate(): void { this.isActive = false; }
}