import type { VendorBillEntity } from '../entities/vendor-bill.entity';

export interface IVendorBillRepository {
  findByOrder(orderId: string): Promise<VendorBillEntity[]>;
  findById(id: string): Promise<VendorBillEntity | null>;
  create(bill: VendorBillEntity): Promise<VendorBillEntity>;
  update(id: string, data: Partial<VendorBillEntity>): Promise<VendorBillEntity>;
}

export const VENDOR_BILL_REPOSITORY = 'VENDOR_BILL_REPOSITORY';