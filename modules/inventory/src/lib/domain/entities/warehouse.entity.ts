export interface WarehousePermissions {
  view: string;
  view_employees?: string[];
  view_roles?: string[];
  view_branches?: string[];
  createInvoice: string;
  createInvoice_employees?: string[];
  createInvoice_roles?: string[];
  createInvoice_branches?: string[];
  updateStock: string;
  updateStock_employees?: string[];
  updateStock_roles?: string[];
  updateStock_branches?: string[];
}

export class WarehouseEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public address: string | null,
    public branchId: string,
    public companyId: string,
    public isActive: boolean,
    public isPrimary: boolean,
    public permissions: WarehousePermissions | null,
  ) {}

  static create(data: {
    id: string;
    name: string;
    branchId: string;
    companyId: string;
    address?: string;
    isPrimary?: boolean;
    permissions?: WarehousePermissions;
  }): WarehouseEntity {
    return new WarehouseEntity(
      data.id,
      data.name,
      data.address ?? null,
      data.branchId,
      data.companyId,
      true,
      data.isPrimary ?? false,
      data.permissions ?? null,
    );
  }

  deactivate(): void { this.isActive = false; }
}