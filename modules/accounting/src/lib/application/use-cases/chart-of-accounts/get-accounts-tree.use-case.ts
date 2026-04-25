import { Injectable, Inject } from '@nestjs/common';

import { CHART_OF_ACCOUNT_REPOSITORY } from '../../../domain/repositories/chart-of-account.repository.interface';
import type { IChartOfAccountRepository } from '../../../domain/repositories/chart-of-account.repository.interface';

import { ChartOfAccountEntity } from '../../../domain/entities/chart-of-account.entity';

@Injectable()
export class GetAccountsTreeUseCase {

  constructor(
    @Inject(CHART_OF_ACCOUNT_REPOSITORY)
    private readonly repository: IChartOfAccountRepository,
  ) {}

  async execute(companyId: string): Promise<ChartOfAccountEntity[]> {
    const accounts = await this.repository.findTree(companyId);

    const map = new Map<string, any>();
    const roots: any[] = [];

    accounts.forEach((acc) => {
      map.set(acc.id, { ...acc, children: [] });
    });

    map.forEach((node) => {
      if (node.parentId && map.has(node.parentId)) {
        map.get(node.parentId).children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }
}