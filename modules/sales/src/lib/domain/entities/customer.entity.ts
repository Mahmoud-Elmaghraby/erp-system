export class CustomerEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string | null,
    public phone: string | null,
    public address: string | null,
    public isActive: boolean,
    public readonly companyId: string,
    public taxRegNumber: string | null,
    public commercialReg: string | null,
    public country: string,
    public buyerType: string,
  ) {}

  static create(data: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    companyId: string;
    taxRegNumber?: string;
    commercialReg?: string;
    country?: string;
    buyerType?: string;
  }): CustomerEntity {
    return new CustomerEntity(
      data.id, data.name,
      data.email ?? null,
      data.phone ?? null,
      data.address ?? null,
      true,
      data.companyId,
      data.taxRegNumber ?? null,
      data.commercialReg ?? null,
      data.country ?? 'EG',
      data.buyerType ?? 'B',
    );
  }

  deactivate(): void { this.isActive = false; }
}