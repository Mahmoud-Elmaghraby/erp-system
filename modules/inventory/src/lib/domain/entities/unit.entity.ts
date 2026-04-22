export class UnitEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public symbol: string,
    public readonly companyId: string,
    public readonly unitCode: string | null,
  ) {}

  static create(data: {
    id: string;
    name: string;
    symbol: string;
    companyId: string;
    unitCode?: string;
  }): UnitEntity {
    return new UnitEntity(
      data.id, data.name, data.symbol,
      data.companyId, data.unitCode ?? null,
    );
  }
}