import type { JournalEntryEntity } from '../entities/journal-entry.entity';

export interface IJournalEntryRepository {
  findAll(companyId: string): Promise<JournalEntryEntity[]>;
  findById(id: string): Promise<JournalEntryEntity | null>;
  findByJournal(journalId: string): Promise<JournalEntryEntity[]>;
  findByReference(reference: string): Promise<JournalEntryEntity | null>;
  create(entry: JournalEntryEntity): Promise<JournalEntryEntity>;
  update(id: string, data: Partial<JournalEntryEntity>): Promise<JournalEntryEntity>;
  post(id: string): Promise<JournalEntryEntity>;
  cancel(id: string): Promise<JournalEntryEntity>;
}

export const JOURNAL_ENTRY_REPOSITORY = 'JOURNAL_ENTRY_REPOSITORY';