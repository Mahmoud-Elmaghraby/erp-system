import type { ChartOfAccountEntity } from '../entities/chart-of-account.entity';

export interface IChartOfAccountRepository {
  findAll(companyId: string): Promise<ChartOfAccountEntity[]>;
  findById(id: string): Promise<ChartOfAccountEntity | null>;
  findByCode(code: string, companyId: string): Promise<ChartOfAccountEntity | null>;
  create(account: ChartOfAccountEntity): Promise<ChartOfAccountEntity>;
  update(id: string, data: Partial<ChartOfAccountEntity>): Promise<ChartOfAccountEntity>;
  delete(id: string): Promise<void>;
}

export const CHART_OF_ACCOUNT_REPOSITORY = 'CHART_OF_ACCOUNT_REPOSITORY';