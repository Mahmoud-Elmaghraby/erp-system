import type { TaxEntity } from '../entities/tax.entity';

export interface ITaxRepository {
  findAll(companyId: string): Promise<TaxEntity[]>;
  findById(id: string): Promise<TaxEntity | null>;
  findByScope(companyId: string, scope: string): Promise<TaxEntity[]>;
  create(tax: TaxEntity): Promise<TaxEntity>;
  update(id: string, data: Partial<TaxEntity>): Promise<TaxEntity>;
  delete(id: string): Promise<void>;
}

export const TAX_REPOSITORY = 'TAX_REPOSITORY';