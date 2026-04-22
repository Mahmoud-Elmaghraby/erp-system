import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IVendorBillRepository } from '../../../domain/repositories/vendor-bill.repository.interface';
import { VENDOR_BILL_REPOSITORY } from '../../../domain/repositories/vendor-bill.repository.interface';
import type { IPurchaseOrderRepository } from '../../../domain/repositories/purchase-order.repository.interface';
import { PURCHASE_ORDER_REPOSITORY } from '../../../domain/repositories/purchase-order.repository.interface';
import { VendorBillEntity } from '../../../domain/entities/vendor-bill.entity';
import { CreateVendorBillDto } from '../../dtos/vendor-bill.dto';
import { DocumentSequenceService } from '@org/core';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateVendorBillUseCase {
  constructor(
    @Inject(VENDOR_BILL_REPOSITORY)
    private billRepository: IVendorBillRepository,
    @Inject(PURCHASE_ORDER_REPOSITORY)
    private orderRepository: IPurchaseOrderRepository,
    private documentSequenceService: DocumentSequenceService,
  ) {}

  async execute(dto: CreateVendorBillDto): Promise<VendorBillEntity> {
    const order = await this.orderRepository.findById(dto.orderId);
    if (!order) throw new NotFoundException('Purchase order not found');

    const billNumber = await this.documentSequenceService.getNextNumber(
      order.branchId, 'purchasing', 'bill', 'BILL'
    );

    const bill = VendorBillEntity.create({
      id: randomUUID(),
      billNumber,
      orderId: dto.orderId,
      totalAmount: order.totalAmount,
      dueDate: dto.dueDate,
    });

    return this.billRepository.create(bill);
  }
}