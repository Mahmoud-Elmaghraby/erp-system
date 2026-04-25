import { Injectable, Inject, NotFoundException } from '@nestjs/common';

import { CHART_OF_ACCOUNT_REPOSITORY } from '../../../domain/repositories/chart-of-account.repository.interface';
import type { IChartOfAccountRepository } from '../../../domain/repositories/chart-of-account.repository.interface';

@Injectable()
export class GetAccountByCodeUseCase {

  constructor(
    @Inject(CHART_OF_ACCOUNT_REPOSITORY)
    private readonly repository: IChartOfAccountRepository,
  ) {}

  async execute(code: string, companyId: string) {

    const account = await this.repository.findByCode(code, companyId);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }
}