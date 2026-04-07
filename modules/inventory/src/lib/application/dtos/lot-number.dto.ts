export class CreateLotNumberDto {
  lotNumber!: string;
  productId!: string;
  warehouseId!: string;
  quantity!: number;
  notes?: string;
}