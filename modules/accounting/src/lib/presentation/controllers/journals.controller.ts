import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard } from '@org/core';
import type { IJournalRepository } from '../../domain/repositories/journal.repository.interface';
import { JOURNAL_REPOSITORY } from '../../domain/repositories/journal.repository.interface';
import { JournalEntity } from '../../domain/entities/journal.entity';
import { CreateJournalDto, UpdateJournalDto } from '../../application/dtos/journal.dto';
import { randomUUID } from 'crypto';

@ApiTags('Journals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('journals')
export class JournalsController {
  constructor(
    @Inject(JOURNAL_REPOSITORY)
    private journalRepository: IJournalRepository,
  ) {}

  @Get()
  @RequirePermission('accounting.journals.view')
  findAll(@Query('companyId') companyId: string) {
    return this.journalRepository.findAll(companyId);
  }

  @Get(':id')
  @RequirePermission('accounting.journals.view')
  findOne(@Param('id') id: string) {
    return this.journalRepository.findById(id);
  }

  @Post()
  @RequirePermission('accounting.journals.create')
  create(@Body() dto: CreateJournalDto) {
    const journal = JournalEntity.create({ id: randomUUID(), ...dto });
    return this.journalRepository.create(journal);
  }

  @Patch(':id')
  @RequirePermission('accounting.journals.edit')
  update(@Param('id') id: string, @Body() dto: UpdateJournalDto) {
    return this.journalRepository.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('accounting.journals.delete')
  remove(@Param('id') id: string) {
    return this.journalRepository.delete(id);
  }
}