export class CreateStockAdjustmentDto {
  warehouseId!: string;
  reason!: string;
  notes?: string;
  items!: Array<{
    productId: string;
    expectedQuantity: number;
    actualQuantity: number;
  }>;
}