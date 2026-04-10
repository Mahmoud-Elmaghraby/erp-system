export class CreateTaxDto {
  name!: string;
  rate!: number;
  taxType?: 'PERCENTAGE' | 'FIXED' | 'NONE';
  scope?: 'SALES' | 'PURCHASES' | 'BOTH';
  companyId!: string;
  accountId?: string;
  etaType?: string;
  etaSubtype?: string;
  zatcaType?: string;
}

export class UpdateTaxDto {
  name?: string;
  rate?: number;
  taxType?: 'PERCENTAGE' | 'FIXED' | 'NONE';
  scope?: 'SALES' | 'PURCHASES' | 'BOTH';
  accountId?: string;
  etaType?: string;
  etaSubtype?: string;
  zatcaType?: string;
}