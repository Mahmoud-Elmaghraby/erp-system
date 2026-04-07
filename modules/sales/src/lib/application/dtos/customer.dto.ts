export class CreateCustomerDto {
  name!: string;
  email?: string;
  phone?: string;
  address?: string;
}

export class UpdateCustomerDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}