import type { JournalEntity } from '../entities/journal.entity';

export interface IJournalRepository {
  findAll(companyId: string): Promise<JournalEntity[]>;
  findById(id: string): Promise<JournalEntity | null>;
  findByType(companyId: string, type: string): Promise<JournalEntity | null>;
  create(journal: JournalEntity): Promise<JournalEntity>;
  update(id: string, data: Partial<JournalEntity>): Promise<JournalEntity>;
  delete(id: string): Promise<void>;
}

export const JOURNAL_REPOSITORY = 'JOURNAL_REPOSITORY';