import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import {
  FiscalYearEntity,
  FiscalPeriodEntity,
  FiscalYearStatus as EntityFiscalYearStatus,
  FiscalPeriodStatus as EntityFiscalPeriodStatus,
  FiscalPeriodStatus,
} from '../../domain/entities/fiscal-year.entity';
import type { IFiscalYearRepository } from '../../domain/repositories/fiscal-year.repository.interface';
import { FiscalYearStatus } from '../../../../../../generated/prisma';

@Injectable()
export class FiscalYearRepository implements IFiscalYearRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string): Promise<FiscalYearEntity[]> {
    const years = await this.prisma.fiscalYear.findMany({
      where: { companyId },
      include: { periods: { orderBy: { periodNumber: 'asc' } } },
      orderBy: { startDate: 'desc' },
    });
    return years.map((y) => this.toEntity(y));
  }

  async findById(companyId: string, id: string): Promise<FiscalYearEntity | null> {
    const year = await this.prisma.fiscalYear.findFirst({
      where: { id, companyId },
      include: { periods: { orderBy: { periodNumber: 'asc' } } },
    });
    return year ? this.toEntity(year) : null;
  }

  async findOpen(companyId: string): Promise<FiscalYearEntity | null> {
    const year = await this.prisma.fiscalYear.findFirst({
      where: { companyId, status: FiscalYearStatus.OPEN },
      include: { periods: { orderBy: { periodNumber: 'asc' } } },
    });
    return year ? this.toEntity(year) : null;
  }

  async findPeriodByDate(companyId: string, date: Date): Promise<FiscalPeriodEntity | null> {
    const period = await this.prisma.fiscalPeriod.findFirst({
      where: {
        companyId,
        startDate: { lte: date },
        endDate:   { gte: date },
      },
    });
    return period ? this.toPeriodEntity(period) : null;
  }

  async create(
    entity: FiscalYearEntity,
    periods: FiscalPeriodEntity[],
  ): Promise<FiscalYearEntity> {
    const year = await this.prisma.fiscalYear.create({
      data: {
        id:        entity.id,
        name:      entity.name,
        startDate: entity.startDate,
        endDate:   entity.endDate,
        status:    entity.status as FiscalYearStatus,
        companyId: entity.companyId,
        periods: {
          create: periods.map((p) => ({
            id:           p.id,
            name:         p.name,
            startDate:    p.startDate,
            endDate:      p.endDate,
            periodNumber: p.periodNumber,
            status:       p.status as FiscalPeriodStatus,
            companyId:    p.companyId,
          })),
        },
      },
      include: { periods: { orderBy: { periodNumber: 'asc' } } },
    });
    return this.toEntity(year);
  }

  async updateStatus(companyId: string, id: string, status: string): Promise<FiscalYearEntity> {
    const year = await this.prisma.fiscalYear.update({
      where: { id },
      data: { status: status as FiscalYearStatus },
      include: { periods: { orderBy: { periodNumber: 'asc' } } },
    });
    return this.toEntity(year);
  }

  async updatePeriodStatus(companyId: string, periodId: string, status: string): Promise<FiscalPeriodEntity> {
    const period = await this.prisma.fiscalPeriod.update({
      where: { id: periodId },
      data: { status: status as FiscalPeriodStatus },
    });
    return this.toPeriodEntity(period);
  }

  // ── Mappers ──────────────────────────────────────────────────

  private toEntity(y: any): FiscalYearEntity {
    return new FiscalYearEntity(
      y.id, y.name, y.startDate, y.endDate,
      y.status as EntityFiscalYearStatus,
      y.companyId,
      (y.periods || []).map((p: any) => this.toPeriodEntity(p)),
      y.createdAt,
    );
  }

  private toPeriodEntity(p: any): FiscalPeriodEntity {
    return new FiscalPeriodEntity(
      p.id, p.name, p.startDate, p.endDate,
      p.periodNumber,
      p.status as EntityFiscalPeriodStatus,
      p.companyId, p.fiscalYearId, p.createdAt,
    );
  }
}