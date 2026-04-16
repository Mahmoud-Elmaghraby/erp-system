// modules/accounting/src/lib/domain/repositories/fiscal-year.repository.interface.ts

import type { FiscalYearEntity } from '../entities/fiscal-year.entity';
import type { FiscalPeriodEntity } from '../entities/fiscal-year.entity';

export const FISCAL_YEAR_REPOSITORY = 'FISCAL_YEAR_REPOSITORY';

export interface IFiscalYearRepository {
  findAll(companyId: string): Promise<FiscalYearEntity[]>;
  findById(companyId: string, id: string): Promise<FiscalYearEntity | null>;
  findOpen(companyId: string): Promise<FiscalYearEntity | null>;
  findPeriodByDate(companyId: string, date: Date): Promise<FiscalPeriodEntity | null>;
  create(entity: FiscalYearEntity, periods: FiscalPeriodEntity[]): Promise<FiscalYearEntity>;
  updateStatus(companyId: string, id: string, status: string): Promise<FiscalYearEntity>;
  updatePeriodStatus(companyId: string, periodId: string, status: string): Promise<FiscalPeriodEntity>;
}