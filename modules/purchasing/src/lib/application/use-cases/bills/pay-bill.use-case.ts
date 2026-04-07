import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IVendorBillRepository } from '../../../domain/repositories/vendor-bill.repository.interface';
import { VENDOR_BILL_REPOSITORY } from '../../../domain/repositories/vendor-bill.repository.interface';
import { PayVendorBillDto } from '../../dtos/vendor-bill.dto';

@Injectable()
export class PayVendorBillUseCase {
  constructor(
    @Inject(VENDOR_BILL_REPOSITORY)
    private billRepository: IVendorBillRepository,
  ) {}

  async execute(billId: string, dto: PayVendorBillDto): Promise<void> {
    const bill = await this.billRepository.findById(billId);
    if (!bill) throw new NotFoundException('Bill not found');
    bill.pay(dto.amount);
    await this.billRepository.update(billId, {
      status: bill.status,
      paidAmount: bill.paidAmount,
    });
  }
}