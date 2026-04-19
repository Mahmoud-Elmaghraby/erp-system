import { Injectable, Inject, NotFoundException } from '@nestjs/common';

import { CHART_OF_ACCOUNT_REPOSITORY } from '../../../domain/repositories/chart-of-account.repository.interface';
import type { IChartOfAccountRepository } from '../../../domain/repositories/chart-of-account.repository.interface';

import { ChartOfAccountEntity } from '../../../domain/entities/chart-of-account.entity';

import { UpdateAccountDto } from '../../dtos/update-account.dto';

@Injectable()
export class UpdateChartOfAccountUseCase {
  constructor(
    @Inject(CHART_OF_ACCOUNT_REPOSITORY)
    private readonly accountRepository: IChartOfAccountRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateAccountDto,
    companyId: string,
  ): Promise<ChartOfAccountEntity> {

    // 1️⃣ التأكد من وجود الحساب
    const account = await this.accountRepository.findById(id);

    if (!account || account.companyId !== companyId) {
      throw new NotFoundException('Account not found.');
    }

    // 2️⃣ تنفيذ التعديل
    return this.accountRepository.update(id, {
      name: dto.name,
      category: dto.category,
      role: dto.role,
      normalBalance: dto.normalBalance,
      isGroup: dto.isGroup,
      isActive: dto.isActive,
    });
  }
}