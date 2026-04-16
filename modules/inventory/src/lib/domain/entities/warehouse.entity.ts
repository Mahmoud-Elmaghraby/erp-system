export class WarehouseEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public address: string | null,
    public branchId: string,
    public companyId: string,
    public isActive: boolean,
  ) {}

  static create(data: {
    id: string;
    name: string;
    branchId: string;
    companyId: string;
    address?: string;
  }): WarehouseEntity {
    return new WarehouseEntity(
      data.id, data.name, data.address ?? null,
      data.branchId, data.companyId, true,
    );
  }

  deactivate(): void { this.isActive = false; }
}