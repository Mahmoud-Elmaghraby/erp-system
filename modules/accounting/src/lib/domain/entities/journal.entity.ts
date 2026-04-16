export type JournalType = 'SALE' | 'PURCHASE' | 'CASH' | 'BANK' | 'GENERAL';

export class JournalEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public type: JournalType,
    public companyId: string,
  ) {}

  static create(data: {
    id: string;
    name: string;
    type: JournalType;
    companyId: string;
  }): JournalEntity {
    return new JournalEntity(data.id, data.name, data.type, data.companyId);
  }
}