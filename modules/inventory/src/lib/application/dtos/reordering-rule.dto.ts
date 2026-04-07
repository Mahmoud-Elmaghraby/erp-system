export class UpsertReorderingRuleDto {
  productId!: string;
  warehouseId!: string;
  minQuantity!: number;
  maxQuantity!: number;
  reorderQuantity!: number;
}