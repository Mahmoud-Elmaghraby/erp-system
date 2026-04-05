export class CategoryEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public parentId: string | null,
  ) {}

  static create(data: { id: string; name: string; parentId?: string }): CategoryEntity {
    return new CategoryEntity(data.id, data.name, data.parentId ?? null);
  }
}