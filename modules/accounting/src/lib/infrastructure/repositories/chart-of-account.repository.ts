import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { IChartOfAccountRepository } from '../../domain/repositories/chart-of-account.repository.interface';
import { ChartOfAccountEntity } from '../../domain/entities/chart-of-account.entity';

@Injectable()
export class ChartOfAccountRepository implements IChartOfAccountRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string): Promise<ChartOfAccountEntity[]> {
    const accounts = await this.prisma.chartOfAccount.findMany({
      where: { companyId, isActive: true },
      orderBy: { code: 'asc' },
    });
    return accounts.map(this.toEntity);
  }

  async findById(id: string): Promise<ChartOfAccountEntity | null> {
    const account = await this.prisma.chartOfAccount.findUnique({ where: { id } });
    return account ? this.toEntity(account) : null;
  }

  async findByCode(code: string, companyId: string): Promise<ChartOfAccountEntity | null> {
    const account = await this.prisma.chartOfAccount.findFirst({
      where: { code, companyId },
    });
    return account ? this.toEntity(account) : null;
  }

  async create(entity: ChartOfAccountEntity): Promise<ChartOfAccountEntity> {
    const account = await this.prisma.chartOfAccount.create({
      data: {
        id: entity.id,
        code: entity.code,
        name: entity.name,
        type: entity.type,
        isActive: entity.isActive,
        companyId: entity.companyId,
      },
    });
    return this.toEntity(account);
  }

  async update(id: string, data: Partial<ChartOfAccountEntity>): Promise<ChartOfAccountEntity> {
    const account = await this.prisma.chartOfAccount.update({
      where: { id },
      data: { name: data.name, type: data.type },
    });
    return this.toEntity(account);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.chartOfAccount.update({ where: { id }, data: { isActive: false } });
  }

  private toEntity(a: any): ChartOfAccountEntity {
    return new ChartOfAccountEntity(a.id, a.code, a.name, a.type, a.isActive, a.companyId);
  }
}