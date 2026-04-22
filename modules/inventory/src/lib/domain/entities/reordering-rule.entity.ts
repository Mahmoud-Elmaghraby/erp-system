export class ReorderingRuleEntity {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly warehouseId: string,
    public minQuantity: number,
    public maxQuantity: number,
    public reorderQuantity: number,
    public isActive: boolean,
  ) {}

  static create(data: {
    id: string;
    productId: string;
    warehouseId: string;
    minQuantity: number;
    maxQuantity: number;
    reorderQuantity: number;
  }): ReorderingRuleEntity {
    return new ReorderingRuleEntity(
      data.id, data.productId, data.warehouseId,
      data.minQuantity, data.maxQuantity, data.reorderQuantity, true,
    );
  }

  deactivate(): void { this.isActive = false; }
}