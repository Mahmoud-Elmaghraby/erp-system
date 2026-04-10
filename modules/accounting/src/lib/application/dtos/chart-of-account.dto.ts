export class CreateChartOfAccountDto {
  code!: string;
  name!: string;
  type!: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE' | 'COGS';
  companyId!: string;
}

export class UpdateChartOfAccountDto {
  name?: string;
  type?: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE' | 'COGS';
}