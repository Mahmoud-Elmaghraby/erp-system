import {
  Controller, Get, Post, Patch, Body,
  Param,  UseGuards, Inject,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard, CurrentUser } from '@org/core';
import type { IJournalEntryRepository } from '../../domain/repositories/journal-entry.repository.interface';
import { JOURNAL_ENTRY_REPOSITORY } from '../../domain/repositories/journal-entry.repository.interface';
import { JournalEntryEntity } from '../../domain/entities/journal-entry.entity';
import { JournalItemEntity } from '../../domain/entities/journal-item.entity';
import { FiscalYearService } from '../../application/services/fiscal-year.service';
import { randomUUID } from 'crypto';
import { CreateJournalEntryDto, UpdateJournalEntryDto } from '../../application/dtos/journal-entry.dto';

@ApiTags('Accounting — Journal Entries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('journal-entries')
export class JournalEntriesController {
  constructor(
    @Inject(JOURNAL_ENTRY_REPOSITORY)
    private journalEntryRepository: IJournalEntryRepository,
    private fiscalYearService: FiscalYearService,
  ) {}

  @ApiOperation({ summary: 'قائمة القيود المحاسبية' })
  @RequirePermission('accounting.journal-entries.view')
  @Get()
  findAll(@CurrentUser('companyId') companyId: string) {
    return this.journalEntryRepository.findAll(companyId);
  }

  @ApiOperation({ summary: 'تفاصيل قيد محاسبي' })
  @RequirePermission('accounting.journal-entries.view')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.journalEntryRepository.findById(id);
  }

  @ApiOperation({ summary: 'إنشاء قيد محاسبي يدوي' })
  @RequirePermission('accounting.journal-entries.create')
  @Post()
  async create(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: CreateJournalEntryDto,
  ) {
    const entryDate = new Date(dto.date);

    // ✅ التحقق من الفترة المحاسبية قبل الإنشاء
    const period = await this.fiscalYearService.getPeriodForDate(companyId, entryDate);

    const entryId = randomUUID();
    const items = dto.items.map((item) =>
      JournalItemEntity.create({
        id:        item.id || randomUUID(),
        name:      item.name,
        debit:     item.debit  ?? 0,
        credit:    item.credit ?? 0,
        accountId: item.accountId,
        entryId,
      }),
    );

    const entry = JournalEntryEntity.create({
      id:             entryId,
      reference:      dto.reference,
      date:           entryDate,
      companyId,
      journalId:      dto.journalId,
      fiscalPeriodId: period.id, // ✅ من الـ FiscalYearService
      items,
    });

    return this.journalEntryRepository.create(entry);
  }

  @ApiOperation({ summary: 'تعديل قيد محاسبي' })
  @RequirePermission('accounting.journal-entries.edit')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateJournalEntryDto) {
    return this.journalEntryRepository.update(id, {
      ...dto,
      date: dto.date ? new Date(dto.date) : undefined,
    });
  }

  @ApiOperation({ summary: 'ترحيل قيد محاسبي' })
  @RequirePermission('accounting.journal-entries.post')
  @Patch(':id/post')
  post(@Param('id') id: string) {
    return this.journalEntryRepository.post(id);
  }

  @ApiOperation({ summary: 'إلغاء قيد محاسبي' })
  @RequirePermission('accounting.journal-entries.cancel')
  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.journalEntryRepository.cancel(id);
  }
}