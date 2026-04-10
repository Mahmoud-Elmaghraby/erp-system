export class CreatePaymentTermDto {
  name!: string;
  companyId!: string;
  lines!: Array<{
    value: number;
    valueType: 'PERCENT' | 'FIXED';
    days: number;
  }>;
}

export class UpdatePaymentTermDto {
  name?: string;
  lines?: Array<{
    value: number;
    valueType: 'PERCENT' | 'FIXED';
    days: number;
  }>;
}