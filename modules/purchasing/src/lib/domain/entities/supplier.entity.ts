export class SupplierEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string | null,
    public phone: string | null,
    public address: string | null,
    public taxNumber: string | null,
    public isActive: boolean,
  ) {}

  static create(data: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    taxNumber?: string;
  }): SupplierEntity {
    return new SupplierEntity(
      data.id, data.name, data.email ?? null,
      data.phone ?? null, data.address ?? null,
      data.taxNumber ?? null, true,
    );
  }

  deactivate(): void { this.isActive = false; }
}