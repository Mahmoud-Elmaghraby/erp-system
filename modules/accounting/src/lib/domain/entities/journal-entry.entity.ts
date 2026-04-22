import type { JournalItemEntity } from './journal-item.entity';

export type JournalEntryState = 'DRAFT' | 'POSTED' | 'CANCELLED';

export class JournalEntryEntity {
constructor(
  public readonly id: string,
  public reference: string,
  public date: Date,
  public state: JournalEntryState,
  public companyId: string,
  public journalId: string,
  public items: JournalItemEntity[],
  public fiscalPeriodId: string,
  public readonly createdAt?: Date,
) {}

 static create(data: {
  id: string;
  reference: string;
  date: Date;
  companyId: string;
  journalId: string;
  items: JournalItemEntity[];
  fiscalPeriodId: string; // ✅ أضف ده
}): JournalEntryEntity {
  return new JournalEntryEntity(
    data.id, data.reference, data.date,
    'DRAFT', data.companyId, data.journalId,
    data.items, data.fiscalPeriodId, // ✅ أضف ده
  );
}

  post(): void {
    if (this.state !== 'DRAFT') throw new Error('Only DRAFT entries can be posted');
    if (!this.isBalanced()) throw new Error('Entry is not balanced');
    (this as any).state = 'POSTED';
  }

  cancel(): void {
    if (this.state === 'CANCELLED') throw new Error('Already cancelled');
    (this as any).state = 'CANCELLED';
  }

  isBalanced(): boolean {
    const totalDebit = this.items.reduce((sum, i) => sum + i.debit, 0);
    const totalCredit = this.items.reduce((sum, i) => sum + i.credit, 0);
    return Math.abs(totalDebit - totalCredit) < 0.001;
  }

  getTotalDebit(): number {
    return this.items.reduce((sum, i) => sum + i.debit, 0);
  }

  getTotalCredit(): number {
    return this.items.reduce((sum, i) => sum + i.credit, 0);
  }
}