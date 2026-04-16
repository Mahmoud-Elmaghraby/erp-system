export type AccountType =
  | 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE'
  | 'EXPENSE' | 'COGS' | 'BANK' | 'CASH' | 'RECEIVABLE' | 'PAYABLE';

export type NormalBalance = 'DEBIT' | 'CREDIT';

export class ChartOfAccountEntity {
  constructor(
    public readonly id: string,
    public code: string,
    public name: string,
    public type: AccountType,
    public normalBalance: NormalBalance,
    public level: number,
    public isGroup: boolean,
    public parentId: string | null,
    public isActive: boolean,
    public readonly companyId: string,
  ) {}

  static create(data: {
    id: string;
    code: string;
    name: string;
    type: AccountType;
    normalBalance: NormalBalance;
    level?: number;
    isGroup?: boolean;
    parentId?: string | null;
    companyId: string;
  }): ChartOfAccountEntity {
    return new ChartOfAccountEntity(
      data.id, data.code, data.name, data.type,
      data.normalBalance,
      data.level ?? 1,
      data.isGroup ?? false,
      data.parentId ?? null,
      true,
      data.companyId,
    );
  }

  deactivate(): void { this.isActive = false; }
}