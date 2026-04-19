import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CHART_OF_ACCOUNT_REPOSITORY } from '../../../domain/repositories/chart-of-account.repository.interface';
import type { IChartOfAccountRepository } from '../../../domain/repositories/chart-of-account.repository.interface';

import { ChartOfAccountEntity } from '../../../domain/entities/chart-of-account.entity';

import { CreateAccountDto } from '../../dtos/create-account.dto';

@Injectable()
export class CreateChartOfAccountUseCase {
  constructor(
    @Inject(CHART_OF_ACCOUNT_REPOSITORY)
    private readonly accountRepository: IChartOfAccountRepository,
  ) {}

  async execute(dto: CreateAccountDto, companyId: string): Promise<ChartOfAccountEntity> {

    // 1️⃣ منع تكرار الكود
    const existingAccount = await this.accountRepository.findByCode(dto.code, companyId);

    if (existingAccount) {
      throw new BadRequestException(`Account code '${dto.code}' already exists.`);
    }

    // 2️⃣ التحقق من الحساب الأب
    if (dto.parentId) {

      const parentAccount = await this.accountRepository.findById(dto.parentId);

      if (!parentAccount || parentAccount.companyId !== companyId) {
        throw new NotFoundException('Parent account not found.');
      }

      if (!parentAccount.isGroup) {
        throw new BadRequestException(
          'Cannot create child account under posting account.',
        );
      }
    }

    // 3️⃣ إنشاء الـ Entity
    const account = ChartOfAccountEntity.create({
      id: randomUUID(),
      code: dto.code,
      name: dto.name,
      category: dto.category,
      role: dto.role ?? null,
      normalBalance: dto.normalBalance,
      isGroup: dto.isGroup ?? false,
      parentId: dto.parentId ?? null,
      companyId,
    });

    // 4️⃣ الحفظ
    return this.accountRepository.create(account);
  }
}