export class CreateJournalDto {
  name!: string;
  type!: 'SALE' | 'PURCHASE' | 'CASH' | 'BANK' | 'GENERAL';
  companyId!: string;
}

export class UpdateJournalDto {
  name?: string;
  type?: 'SALE' | 'PURCHASE' | 'CASH' | 'BANK' | 'GENERAL';
}