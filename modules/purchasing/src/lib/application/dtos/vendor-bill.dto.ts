export class CreateVendorBillDto {
  orderId!: string;
  dueDate?: Date;
}

export class PayVendorBillDto {
  amount!: number;
}