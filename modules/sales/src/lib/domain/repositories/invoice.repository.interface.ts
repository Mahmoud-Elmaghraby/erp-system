import { InvoiceEntity } from '../entities/invoice.entity';

export interface IInvoiceRepository {
  findAll(orderId: string): Promise<InvoiceEntity[]>;
  findByBranch(branchId: string): Promise<InvoiceEntity[]>; // ✅ جديد
  findByCompany(companyId: string): Promise<InvoiceEntity[]>;
  findById(id: string): Promise<InvoiceEntity | null>;
  create(invoice: InvoiceEntity): Promise<InvoiceEntity>;
  update(id: string, data: Partial<InvoiceEntity>): Promise<InvoiceEntity>;
}

export const INVOICE_REPOSITORY = 'INVOICE_REPOSITORY';