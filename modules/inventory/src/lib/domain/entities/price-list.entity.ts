export class PriceListItemEntity {
  constructor(
    public readonly id: string,
    public readonly priceListId: string,
    public readonly productId: string,
    public readonly defaultPrice: number,
    public readonly customPrice: number,
  ) {}
}

export class PriceListEntity {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public name: string,
    public status: string,
    public readonly items: PriceListItemEntity[],
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(data: {
    id: string;
    companyId: string;
    name: string;
    status?: string;
    items?: PriceListItemEntity[];
  }): PriceListEntity {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Price list name is required');
    }

    return new PriceListEntity(
      data.id,
      data.companyId,
      data.name,
      data.status ?? 'active',
      data.items ?? [],
    );
  }

  updateDetails(data: { name?: string; status?: string }): void {
    if (data.name !== undefined) this.name = data.name;
    if (data.status !== undefined) this.status = data.status;
  }

  activate(): void {
    this.status = 'active';
  }

  deactivate(): void {
    this.status = 'inactive';
  }
}
