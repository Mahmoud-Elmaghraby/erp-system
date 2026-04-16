
export class CategoryEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public parentId: string | null,
    public readonly companyId: string,
  ) {}

  static create(data: {
    id: string;
    name: string;
    parentId?: string;
    companyId: string;
  }): CategoryEntity {
    return new CategoryEntity(
      data.id,
      data.name,
      data.parentId ?? null,
      data.companyId,
    );
  }
}

