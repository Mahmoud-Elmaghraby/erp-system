export class AddStockDto {
  warehouseId!: string;
  productId!: string;
  quantity!: number;
  reason?: string;
}

export class RemoveStockDto {
  warehouseId!: string;
  productId!: string;
  quantity!: number;
  reason?: string;
}

export class TransferStockDto {
  fromWarehouseId!: string;
  toWarehouseId!: string;
  productId!: string;
  quantity!: number;
}