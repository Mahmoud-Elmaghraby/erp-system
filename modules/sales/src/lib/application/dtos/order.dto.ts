export class CreateOrderDto {
  branchId!: string;
  customerId?: string;
  notes?: string;
  items!: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
}