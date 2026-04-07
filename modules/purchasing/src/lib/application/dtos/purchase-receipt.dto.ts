export class CreatePurchaseReceiptDto {
  orderId!: string;
  warehouseId!: string;
  notes?: string;
  items!: Array<{
    productId: string;
    receivedQty: number;
  }>;
}