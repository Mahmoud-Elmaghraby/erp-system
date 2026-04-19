import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';

import { CHART_OF_ACCOUNT_REPOSITORY } from '../../../domain/repositories/chart-of-account.repository.interface';
import type { IChartOfAccountRepository } from '../../../domain/repositories/chart-of-account.repository.interface';

@Injectable()
export class MoveAccountUseCase {

  constructor(
    @Inject(CHART_OF_ACCOUNT_REPOSITORY)
    private readonly repository: IChartOfAccountRepository,
  ) {}

  async execute(id: string, parentId: string | null, companyId: string) {

    const account = await this.repository.findById(id);

    if (!account || account.companyId !== companyId) {
      throw new NotFoundException('Account not found');
    }

    if (parentId) {
      const parent = await this.repository.findById(parentId);

      if (!parent || parent.companyId !== companyId) {
        throw new NotFoundException('Parent account not found');
      }

      if (!parent.isGroup) {
        throw new BadRequestException('Parent must be a group account');
      }

      if (parent.id === id) {
        throw new BadRequestException('Account cannot be parent of itself');
      }
    }

    return this.repository.moveAccount(id, parentId);
  }
}