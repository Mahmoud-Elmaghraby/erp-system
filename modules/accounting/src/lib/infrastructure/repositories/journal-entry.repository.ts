import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { IJournalEntryRepository } from '../../domain/repositories/journal-entry.repository.interface';
import { JournalEntryEntity, JournalEntryState } from '../../domain/entities/journal-entry.entity';
import { JournalItemEntity } from '../../domain/entities/journal-item.entity';
import { JournalEntryState as PrismaJournalEntryState } from '../../../../../../generated/prisma';

@Injectable()
export class JournalEntryRepository implements IJournalEntryRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string): Promise<JournalEntryEntity[]> {
    const entries = await this.prisma.journalEntry.findMany({
      where: { companyId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return entries.map((e) => this.toEntity(e));
  }

  async findById(id: string): Promise<JournalEntryEntity | null> {
    const entry = await this.prisma.journalEntry.findUnique({
      where: { id },
      include: { items: true, journal: true },
    });
    return entry ? this.toEntity(entry) : null;
  }

  async findByJournal(journalId: string): Promise<JournalEntryEntity[]> {
    const entries = await this.prisma.journalEntry.findMany({
      where: { journalId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return entries.map((e) => this.toEntity(e));
  }

  async findByReference(reference: string): Promise<JournalEntryEntity | null> {
    const entry = await this.prisma.journalEntry.findFirst({
      where: { reference },
      include: { items: true },
    });
    return entry ? this.toEntity(entry) : null;
  }

  async create(entity: JournalEntryEntity): Promise<JournalEntryEntity> {
    const entry = await this.prisma.journalEntry.create({
      data: {
        id:             entity.id,
        reference:      entity.reference,
        date:           entity.date,
        state:          entity.state as PrismaJournalEntryState,
        companyId:      entity.companyId,
        journalId:      entity.journalId,
        fiscalPeriodId: entity.fiscalPeriodId,
        currencyId:     'EGP',       // default — هيتحدث لما نضيف multi-currency
        createdById:    entity.companyId, // مؤقت — هيتحدث لما نضيف currentUser
        items: {
          create: entity.items.map((item) => ({
            id:        item.id,
            name:      item.name,
            debit:     item.debit,
            credit:    item.credit,
            accountId: item.accountId,
          })),
        },
      },
      include: { items: true },
    });
    return this.toEntity(entry);
  }

  async update(id: string, data: Partial<JournalEntryEntity>): Promise<JournalEntryEntity> {
    const entry = await this.prisma.journalEntry.update({
      where: { id },
      data: {
        reference: data.reference,
        date:      data.date,
        journalId: data.journalId,
      },
      include: { items: true },
    });
    return this.toEntity(entry);
  }

  async post(id: string): Promise<JournalEntryEntity> {
    const entry = await this.prisma.journalEntry.update({
      where: { id },
      data: { state: PrismaJournalEntryState.POSTED },
      include: { items: true },
    });
    return this.toEntity(entry);
  }

  async cancel(id: string): Promise<JournalEntryEntity> {
    const entry = await this.prisma.journalEntry.update({
      where: { id },
      data: { state: PrismaJournalEntryState.CANCELLED },
      include: { items: true },
    });
    return this.toEntity(entry);
  }

  private toEntity(e: any): JournalEntryEntity {
    const items = (e.items || []).map((i: any) =>
      new JournalItemEntity(
        i.id, i.name,
        Number(i.debit), Number(i.credit),
        i.accountId, i.entryId,
      ),
    );
    return new JournalEntryEntity(
      e.id, e.reference, e.date,
      e.state as JournalEntryState,
      e.companyId, e.journalId,
      items,
      e.fiscalPeriodId,
      e.createdAt,
    );
  }
}