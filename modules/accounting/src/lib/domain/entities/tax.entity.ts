export type TaxType = 'PERCENTAGE' | 'FIXED' | 'NONE';
export type TaxScope = 'SALES' | 'PURCHASES' | 'BOTH';

export class TaxEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public rate: number,
    public taxType: TaxType,
    public scope: TaxScope,
    public isActive: boolean,
    public companyId: string,
    public accountId: string | null,
    public etaType: string | null,
    public etaSubtype: string | null,
    public zatcaType: string | null,
  ) {}

  static create(data: {
    id: string;
    name: string;
    rate: number;
    taxType?: TaxType;
    scope?: TaxScope;
    companyId: string;
    accountId?: string;
    etaType?: string;
    etaSubtype?: string;
    zatcaType?: string;
  }): TaxEntity {
    return new TaxEntity(
      data.id, data.name, data.rate,
      data.taxType ?? 'PERCENTAGE',
      data.scope ?? 'BOTH',
      true, data.companyId,
      data.accountId ?? null,
      data.etaType ?? null,
      data.etaSubtype ?? null,
      data.zatcaType ?? null,
    );
  }

  calculateAmount(baseAmount: number): number {
    if (this.taxType === 'NONE') return 0;
    if (this.taxType === 'FIXED') return this.rate;
    return (baseAmount * this.rate) / 100;
  }

  deactivate(): void { this.isActive = false; }
}