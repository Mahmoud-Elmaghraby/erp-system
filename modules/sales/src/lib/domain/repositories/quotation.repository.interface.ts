import type { QuotationEntity } from '../entities/quotation.entity';

export interface IQuotationRepository {
  findAll(branchId: string): Promise<QuotationEntity[]>;
  findById(id: string): Promise<QuotationEntity | null>;
  create(quotation: QuotationEntity): Promise<QuotationEntity>;
  update(id: string, data: Partial<QuotationEntity>): Promise<QuotationEntity>;
  delete(id: string): Promise<void>;
}

export const QUOTATION_REPOSITORY = 'QUOTATION_REPOSITORY';