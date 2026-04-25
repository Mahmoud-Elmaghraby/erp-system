import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';

import { CHART_OF_ACCOUNT_REPOSITORY } from '../../../domain/repositories/chart-of-account.repository.interface';
import type { IChartOfAccountRepository } from '../../../domain/repositories/chart-of-account.repository.interface';

@Injectable()
export class DeleteAccountUseCase {

  constructor(
    @Inject(CHART_OF_ACCOUNT_REPOSITORY)
    private readonly repository: IChartOfAccountRepository,
  ) {}

  async execute(id: string, companyId: string) {

    const account = await this.repository.findById(id);

    if (!account || account.companyId !== companyId) {
      throw new NotFoundException('Account not found');
    }

    const hasChildren = await this.repository.hasChildren(id);

    if (hasChildren) {
      throw new BadRequestException('Cannot delete account with children');
    }

    return this.repository.delete(id);
  }
}