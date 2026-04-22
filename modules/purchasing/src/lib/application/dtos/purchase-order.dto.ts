export class CreatePurchaseOrderDto {
  supplierId!: string;
  warehouseId!: string;
  branchId!: string;
  notes?: string;
  currency?: string;
  exchangeRate?: number;
  expectedDate?: Date;
  items!: Array<{
    productId: string;
    quantity: number;
    unitCost: number;
  }>;
}