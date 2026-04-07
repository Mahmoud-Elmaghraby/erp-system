export class CreateInvoiceDto {
  orderId!: string;
  dueDate?: Date;
}

export class PayInvoiceDto {
  amount!: number;
}