<<<<<<< HEAD
import type { ChartOfAccountEntity } from '../entities/chart-of-account.entity';

export interface IChartOfAccountRepository {
  findAll(companyId: string): Promise<ChartOfAccountEntity[]>;
  findById(id: string): Promise<ChartOfAccountEntity | null>;
  findByCode(code: string, companyId: string): Promise<ChartOfAccountEntity | null>;
  create(account: ChartOfAccountEntity): Promise<ChartOfAccountEntity>;
  update(id: string, data: Partial<ChartOfAccountEntity>): Promise<ChartOfAccountEntity>;
  delete(id: string): Promise<void>;
}

=======
import type { ChartOfAccountEntity } from '../entities/chart-of-account.entity';

export interface IChartOfAccountRepository {

  // القراءة
  findAll(companyId: string): Promise<ChartOfAccountEntity[]>;

  findById(id: string): Promise<ChartOfAccountEntity | null>;

  findByCode(code: string, companyId: string): Promise<ChartOfAccountEntity | null>;

  findChildren(parentId: string, companyId: string): Promise<ChartOfAccountEntity[]>;

  findTree(companyId: string): Promise<ChartOfAccountEntity[]>;

  // الكتابة
  create(account: ChartOfAccountEntity): Promise<ChartOfAccountEntity>;

  update(
    id: string,
    data: Partial<ChartOfAccountEntity>,
  ): Promise<ChartOfAccountEntity>;

  delete(id: string): Promise<void>;

  moveAccount(
    id: string,
    parentId: string | null,
  ): Promise<ChartOfAccountEntity>;

  // validation
  hasChildren(id: string): Promise<boolean>;

  exists(id: string): Promise<boolean>;
}

>>>>>>> main
export const CHART_OF_ACCOUNT_REPOSITORY = 'CHART_OF_ACCOUNT_REPOSITORY';