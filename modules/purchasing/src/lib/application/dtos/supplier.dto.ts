export class CreateSupplierDto {
  name!: string;
  email?: string;
  phone?: string;
  address?: string;
  taxNumber?: string;
}

export class UpdateSupplierDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxNumber?: string;
}