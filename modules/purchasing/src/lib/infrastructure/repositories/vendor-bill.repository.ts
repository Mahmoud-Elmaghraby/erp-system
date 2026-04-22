import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { IVendorBillRepository } from '../../domain/repositories/vendor-bill.repository.interface';
import { VendorBillEntity } from '../../domain/entities/vendor-bill.entity';

@Injectable()
export class VendorBillRepository implements IVendorBillRepository {
  constructor(private prisma: PrismaService) {}

  async findByOrder(orderId: string): Promise<VendorBillEntity[]> {
    const bills = await this.prisma.vendorBill.findMany({ where: { orderId } });
    return bills.map(this.toEntity);
  }

  async findById(id: string): Promise<VendorBillEntity | null> {
    const bill = await this.prisma.vendorBill.findUnique({ where: { id } });
    return bill ? this.toEntity(bill) : null;
  }

  async create(entity: VendorBillEntity): Promise<VendorBillEntity> {
    const bill = await this.prisma.vendorBill.create({
      data: {
        id: entity.id, billNumber: entity.billNumber,
        status: entity.status, totalAmount: entity.totalAmount,
        paidAmount: entity.paidAmount, orderId: entity.orderId,
        dueDate: entity.dueDate,
      },
    });
    return this.toEntity(bill);
  }

  async update(id: string, data: Partial<VendorBillEntity>): Promise<VendorBillEntity> {
    const bill = await this.prisma.vendorBill.update({
      where: { id },
      data: { status: data.status, paidAmount: data.paidAmount },
    });
    return this.toEntity(bill);
  }

  private toEntity(b: any): VendorBillEntity {
    return new VendorBillEntity(
      b.id, b.billNumber, b.status,
      Number(b.totalAmount), Number(b.paidAmount),
      b.orderId, b.dueDate,
    );
  }
}