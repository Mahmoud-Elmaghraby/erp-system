export class CreateWarehouseDto {
  name!: string;
  branchId!: string;
  address?: string;
}

export class UpdateWarehouseDto {
  name?: string;
  address?: string;
}