export class JournalItemEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public debit: number,
    public credit: number,
    public accountId: string,
    public entryId: string,
  ) {}

  static create(data: {
    id: string;
    name: string;
    debit?: number;
    credit?: number;
    accountId: string;
    entryId: string;
  }): JournalItemEntity {
    return new JournalItemEntity(
      data.id, data.name,
      data.debit ?? 0,
      data.credit ?? 0,
      data.accountId,
      data.entryId,
    );
  }

  isBalanced(): boolean {
    return this.debit >= 0 && this.credit >= 0;
  }
}