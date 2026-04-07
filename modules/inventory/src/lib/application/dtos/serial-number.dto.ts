export class CreateSerialNumbersDto {
  productId!: string;
  warehouseId!: string;
  serialNumbers!: string[];
  notes?: string;
}

export class UpdateSerialNumberStatusDto {
  status!: 'IN_STOCK' | 'SOLD' | 'RETURNED' | 'DAMAGED';
}