// modules/accounting/src/lib/domain/entities/fiscal-year.entity.ts

export type FiscalYearStatus = 'OPEN' | 'CLOSED' | 'LOCKED';
export type FiscalPeriodStatus = 'OPEN' | 'SOFT_LOCKED' | 'HARD_LOCKED';

export class FiscalPeriodEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly periodNumber: number,
    public status: FiscalPeriodStatus,
    public readonly companyId: string,
    public readonly fiscalYearId: string,
    public readonly createdAt?: Date,
  ) {}

  softLock(): void {
    if (this.status === 'HARD_LOCKED')
      throw new Error('الفترة مقفولة نهائياً ولا يمكن تعديلها');
    (this as any).status = 'SOFT_LOCKED';
  }

  hardLock(): void {
    (this as any).status = 'HARD_LOCKED';
  }

  open(): void {
    if (this.status === 'HARD_LOCKED')
      throw new Error('الفترة مقفولة نهائياً ولا يمكن فتحها');
    (this as any).status = 'OPEN';
  }

  isOpen(): boolean {
    return this.status === 'OPEN';
  }

  canPostEntry(): boolean {
    return this.status === 'OPEN';
  }
}

export class FiscalYearEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public status: FiscalYearStatus,
    public readonly companyId: string,
    public periods: FiscalPeriodEntity[],
    public readonly createdAt?: Date,
  ) {}

  static create(data: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    companyId: string;
  }): FiscalYearEntity {
    return new FiscalYearEntity(
      data.id, data.name, data.startDate, data.endDate,
      'OPEN', data.companyId, [],
    );
  }

  close(): void {
    if (this.status === 'LOCKED')
      throw new Error('السنة المالية مقفولة نهائياً');
    if (this.periods.some((p) => p.status === 'OPEN'))
      throw new Error('لا يمكن إقفال السنة المالية — يوجد فترات مفتوحة');
    (this as any).status = 'CLOSED';
  }

  lock(): void {
    if (this.status !== 'CLOSED')
      throw new Error('يجب إقفال السنة المالية أولاً قبل القفل النهائي');
    (this as any).status = 'LOCKED';
  }

  isOpen(): boolean {
    return this.status === 'OPEN';
  }

  getPeriodByDate(date: Date): FiscalPeriodEntity | null {
    return this.periods.find(
      (p) => date >= p.startDate && date <= p.endDate,
    ) ?? null;
  }
}