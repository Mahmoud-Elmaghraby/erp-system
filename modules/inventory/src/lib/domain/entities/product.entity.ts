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
    public readonly companyId: string,
    public itemCode: string | null,
    public itemType: string | null,
    public unitType: string | null,
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
    companyId: string;
    itemCode?: string;
    itemType?: string;
    unitType?: string;
  }): ProductEntity {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Product name is required');
    }

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
      data.companyId,
      data.itemCode ?? null,
      data.itemType ?? null,
      data.unitType ?? null,
    );
  }

  updateDetails(data: {
    name?: string;
    description?: string;
    barcode?: string;
    sku?: string;
    categoryId?: string;
    unitOfMeasureId?: string;
    itemCode?: string;
    itemType?: string;
    unitType?: string;
  }): void {
    if (data.name !== undefined) this.name = data.name;
    if (data.description !== undefined) this.description = data.description;
    if (data.barcode !== undefined) this.barcode = data.barcode;
    if (data.sku !== undefined) this.sku = data.sku;
    if (data.categoryId !== undefined) this.categoryId = data.categoryId;
    if (data.unitOfMeasureId !== undefined) this.unitOfMeasureId = data.unitOfMeasureId;
    if (data.itemCode !== undefined) this.itemCode = data.itemCode;
    if (data.itemType !== undefined) this.itemType = data.itemType;
    if (data.unitType !== undefined) this.unitType = data.unitType;
  }

  updatePrice(price: Money): void { this.price = price; }
  updateCost(cost: Money): void { this.cost = cost; }
  activate(): void { this.isActive = true; }
  deactivate(): void { this.isActive = false; }
}