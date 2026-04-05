export class WarehouseEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public address: string | null,
    public branchId: string,
    public isActive: boolean,
  ) {}

  static create(data: {
    id: string;
    name: string;
    branchId: string;
    address?: string;
  }): WarehouseEntity {
    return new WarehouseEntity(data.id, data.name, data.address ?? null, data.branchId, true);
  }

  deactivate(): void { this.isActive = false; }
}