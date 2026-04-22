export type ValueType = 'PERCENT' | 'FIXED';

export interface PaymentTermLine {
  id: string;
  value: number;
  valueType: ValueType;
  days: number;
}

export class PaymentTermEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public readonly companyId: string,
    public lines: PaymentTermLine[],
  ) {}

  static create(data: {
    id: string;
    name: string;
    companyId: string;
    lines: Array<{ id: string; value: number; valueType: ValueType; days: number }>;
  }): PaymentTermEntity {
    return new PaymentTermEntity(data.id, data.name, data.companyId, data.lines);
  }

  getDueDate(invoiceDate: Date): Date {
    const maxDays = Math.max(...this.lines.map(l => l.days));
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + maxDays);
    return dueDate;
  }
}