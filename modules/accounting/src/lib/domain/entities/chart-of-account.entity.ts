export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE' | 'COGS';

export class ChartOfAccountEntity {
  constructor(
    public readonly id: string,
    public code: string,
    public name: string,
    public type: AccountType,
    public isActive: boolean,
    public readonly companyId: string,
  ) {}

  static create(data: {
    id: string;
    code: string;
    name: string;
    type: AccountType;
    companyId: string;
  }): ChartOfAccountEntity {
    return new ChartOfAccountEntity(
      data.id, data.code, data.name, data.type, true, data.companyId,
    );
  }

  deactivate(): void { this.isActive = false; }
}