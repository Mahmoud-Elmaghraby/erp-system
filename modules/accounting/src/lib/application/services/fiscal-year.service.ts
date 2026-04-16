// modules/accounting/src/lib/application/services/fiscal-year.service.ts

import {
  Injectable, Inject, NotFoundException,
  BadRequestException, ConflictException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import type { IFiscalYearRepository } from '../../domain/repositories/fiscal-year.repository.interface';
import { FISCAL_YEAR_REPOSITORY } from '../../domain/repositories/fiscal-year.repository.interface';
import { FiscalYearEntity, FiscalPeriodEntity } from '../../domain/entities/fiscal-year.entity';
import { CreateFiscalYearDto } from '../dtos/fiscal-year.dto';

const ARABIC_MONTHS = [
  'يناير','فبراير','مارس','أبريل','مايو','يونيو',
  'يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر',
];

@Injectable()
export class FiscalYearService {
  constructor(
    @Inject(FISCAL_YEAR_REPOSITORY)
    private readonly fiscalYearRepo: IFiscalYearRepository,
  ) {}

  // ── Queries ──────────────────────────────────────────────────

  async findAll(companyId: string): Promise<FiscalYearEntity[]> {
    return this.fiscalYearRepo.findAll(companyId);
  }

  async findById(companyId: string, id: string): Promise<FiscalYearEntity> {
    const year = await this.fiscalYearRepo.findById(companyId, id);
    if (!year) throw new NotFoundException('السنة المالية غير موجودة');
    return year;
  }

  // ── الأهم — بيتاستخدم في كل قيد محاسبي ──────────────────────
  async getPeriodForDate(companyId: string, date: Date): Promise<FiscalPeriodEntity> {
    const period = await this.fiscalYearRepo.findPeriodByDate(companyId, date);
    if (!period)
      throw new BadRequestException(
        `لا توجد سنة مالية مفتوحة تغطي تاريخ ${date.toISOString().split('T')[0]}`,
      );
    if (!period.canPostEntry())
      throw new BadRequestException(
        `الفترة المحاسبية "${period.name}" مقفولة — لا يمكن إضافة قيود عليها`,
      );
    return period;
  }

  // ── Commands ─────────────────────────────────────────────────

  async create(companyId: string, dto: CreateFiscalYearDto): Promise<FiscalYearEntity> {
    // مش ينفع يبقى فيه سنتين OPEN في نفس الوقت
    const existing = await this.fiscalYearRepo.findOpen(companyId);
    if (existing)
      throw new ConflictException(
        `يوجد سنة مالية مفتوحة بالفعل: ${existing.name} — أقفلها أولاً`,
      );

    const startDate = new Date(dto.startDate);
    const endDate   = new Date(dto.endDate);

    if (startDate >= endDate)
      throw new BadRequestException('تاريخ البداية يجب أن يكون قبل تاريخ النهاية');

    const fiscalYearId = uuidv4();

    const entity = FiscalYearEntity.create({
      id: fiscalYearId,
      name: dto.name,
      startDate,
      endDate,
      companyId,
    });

    // توليد الفترات تلقائياً (شهر بشهر)
    const periods = this.generatePeriods(fiscalYearId, companyId, startDate, endDate);

    return this.fiscalYearRepo.create(entity, periods);
  }

  async close(companyId: string, id: string): Promise<FiscalYearEntity> {
    const year = await this.findById(companyId, id);
    year.close(); // بيعمل validation في الـ entity
    return this.fiscalYearRepo.updateStatus(companyId, id, 'CLOSED');
  }

  async lock(companyId: string, id: string): Promise<FiscalYearEntity> {
    const year = await this.findById(companyId, id);
    year.lock();
    return this.fiscalYearRepo.updateStatus(companyId, id, 'LOCKED');
  }

  async updatePeriodStatus(
    companyId: string,
    periodId: string,
    status: 'OPEN' | 'SOFT_LOCKED' | 'HARD_LOCKED',
  ): Promise<FiscalPeriodEntity> {
    return this.fiscalYearRepo.updatePeriodStatus(companyId, periodId, status);
  }

  // ── Private ──────────────────────────────────────────────────

  private generatePeriods(
    fiscalYearId: string,
    companyId: string,
    startDate: Date,
    endDate: Date,
  ): FiscalPeriodEntity[] {
    const periods: FiscalPeriodEntity[] = [];
    let current = new Date(startDate);
    let periodNumber = 1;

    while (current <= endDate) {
      const periodStart = new Date(current);
      const periodEnd   = new Date(current.getFullYear(), current.getMonth() + 1, 0, 23, 59, 59, 999);
      const actualEnd   = periodEnd > endDate ? endDate : periodEnd;
      const monthName   = ARABIC_MONTHS[current.getMonth()];

      periods.push(
        new FiscalPeriodEntity(
          uuidv4(),
          `${monthName} ${current.getFullYear()}`,
          periodStart,
          actualEnd,
          periodNumber,
          'OPEN',
          companyId,
          fiscalYearId,
        ),
      );

      current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
      periodNumber++;
    }

    return periods;
  }
}