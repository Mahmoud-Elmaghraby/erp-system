export class CustomerEntity {
  constructor(
    public readonly id: string,
    public code: string,
    public name: string,
    public email: string | null,
    public phone: string | null,
    public nationalId: string | null,
    public taxNumber: string | null,
    public address: string | null,
    public isActive: boolean,
    public readonly companyId: string,
    public country: string,
    public buyerType: string,
    public status: 'active' | 'inactive',
  ) {}

  static create(data: {
    id: string;
    code?: string;
    name: string;
    email?: string;
    phone?: string;
    nationalId?: string;
    taxNumber?: string;
    address?: string;
    companyId: string;
    country?: string;
    buyerType?: string;
    status?: 'active' | 'inactive';
  }): CustomerEntity {
    const generatedCode = data.code ?? `CUST-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const status = data.status ?? 'active';

    return new CustomerEntity(
      data.id,
      generatedCode,
      data.name,
      data.email ?? null,
      data.phone ?? null,
      data.nationalId ?? null,
      data.taxNumber ?? null,
      data.address ?? null,
      status === 'active',
      data.companyId,
      data.country ?? 'EG',
      data.buyerType ?? 'B',
      status,
    );
  }

  deactivate(): void { this.isActive = false; }
}