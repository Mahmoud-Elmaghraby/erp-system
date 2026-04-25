// Enums (Matching Backend)
export enum AccountCategory {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE',
}

export enum NormalBalance {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export enum AccountRole {
  CASH = 'CASH',
  BANK = 'BANK',
  ACCOUNTS_RECEIVABLE = 'ACCOUNTS_RECEIVABLE',
  ACCOUNTS_PAYABLE = 'ACCOUNTS_PAYABLE',
  TAX = 'TAX',
  // ضيف هنا أي أدوار تانية موجودة عندك في الباك إند
}

// Main Entity Type
export interface ChartOfAccount {
  id: string;
  code: string;
  name: string;
  category: AccountCategory;
  role: AccountRole | null;
  normalBalance: NormalBalance;
  isGroup: boolean;
  parentId: string | null;
  isActive: boolean;
  companyId: string;
  // الخاصية دي بنضيفها عشان الـ Tree UseCase اللي بيرجعها متفرعة
  children?: ChartOfAccount[]; 
}

// Payload Types (Matching DTOs)
export interface CreateAccountPayload {
  code: string;
  name: string;
  category: AccountCategory;
  normalBalance: NormalBalance;
  role?: AccountRole;
  parentId?: string;
  isGroup?: boolean;
}

export interface UpdateAccountPayload {
  name?: string;
  category?: AccountCategory;
  role?: AccountRole;
  normalBalance?: NormalBalance;
  isGroup?: boolean;
  isActive?: boolean;
}