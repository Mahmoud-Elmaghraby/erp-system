import type { PaymentTermEntity } from '../entities/payment-term.entity';

export interface IPaymentTermRepository {
  findAll(companyId: string): Promise<PaymentTermEntity[]>;
  findById(id: string): Promise<PaymentTermEntity | null>;
  create(term: PaymentTermEntity): Promise<PaymentTermEntity>;
  update(id: string, data: Partial<PaymentTermEntity>): Promise<PaymentTermEntity>;
  delete(id: string): Promise<void>;
}

export const PAYMENT_TERM_REPOSITORY = 'PAYMENT_TERM_REPOSITORY';