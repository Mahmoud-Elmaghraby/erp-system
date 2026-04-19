import {
  AccountCategory,
  AccountRole,
  NormalBalance,
} from '../types/account.types';


export class ChartOfAccountEntity {
  constructor(
    public readonly id: string,
    public code: string,
    public name: string,

    // نوع الحساب المحاسبي
    public category: AccountCategory,

    // الدور داخل النظام (اختياري)
    public role: AccountRole | null,

    public normalBalance: NormalBalance,

    // هل حساب تجميعي
    public isGroup: boolean,

    public parentId: string | null,

    public isActive: boolean,

    public readonly companyId: string,
  ) {}

  static create(data: {
    id: string;
    code: string;
    name: string;
    category: AccountCategory;
    role?: AccountRole | null;
    normalBalance: NormalBalance;
    isGroup?: boolean;
    parentId?: string | null;
    companyId: string;
  }): ChartOfAccountEntity {

    // basic validation
    if (!data.code) {
      throw new Error('Account code is required');
    }

    if (!data.name) {
      throw new Error('Account name is required');
    }

    return new ChartOfAccountEntity(
      data.id,
      data.code,
      data.name,
      data.category,
      data.role ?? null,
      data.normalBalance,
      data.isGroup ?? false,
      data.parentId ?? null,
      true,
      data.companyId,
    );
  }

  deactivate(): void {
    this.isActive = false;
  }

  activate(): void {
    this.isActive = true;
  }

  rename(name: string): void {
    if (!name) {
      throw new Error('Account name cannot be empty');
    }

    this.name = name;
  }

  changeParent(parentId: string | null): void {
    this.parentId = parentId;
  }

  makeGroup(): void {
    this.isGroup = true;
  }

  makePosting(): void {
    this.isGroup = false;
  }

  ensurePostingAllowed(): void {
    if (this.isGroup) {
      throw new Error('Cannot post journal entries to a group account');
    }

    if (!this.isActive) {
      throw new Error('Cannot post to an inactive account');
    }
  }
}