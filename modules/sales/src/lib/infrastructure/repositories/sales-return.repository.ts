import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { ISalesReturnRepository } from '../../domain/repositories/sales-return.repository.interface';
import { SalesReturnEntity, SalesReturnStatus } from '../../domain/entities/sales-return.entity';
import { SalesReturnItemEntity } from '../../domain/entities/sales-return-item.entity';

type NumericValue = number | string | { toString(): string };

type SalesReturnItemRecord = {
  id: string;
  productId: string;
  quantity: NumericValue;
  unitPrice: NumericValue;
  total: NumericValue;
  returnId: string;
};

type SalesReturnRecord = {
  id: string;
  returnNumber: string;
  status: SalesReturnStatus;
  reason: string;
  notes: string | null;
  totalAmount: NumericValue;
  orderId: string;
  customerId: string | null;
  createdAt?: Date;
  items?: SalesReturnItemRecord[];
};

const toNumber = (value: NumericValue): number => Number(value);

@Injectable()
export class SalesReturnRepository implements ISalesReturnRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(orderId: string): Promise<SalesReturnEntity[]> {
    const returns = await this.prisma.salesReturn.findMany({
      where: { orderId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return returns.map(this.toEntity);
  }

  async findById(id: string): Promise<SalesReturnEntity | null> {
    const salesReturn = await this.prisma.salesReturn.findUnique({
      where: { id },
      include: { items: true, customer: true },
    });
    return salesReturn ? this.toEntity(salesReturn) : null;
  }

  async create(entity: SalesReturnEntity): Promise<SalesReturnEntity> {
    const salesReturn = await this.prisma.salesReturn.create({
      data: {
        id: entity.id,
        returnNumber: entity.returnNumber,
        status: entity.status,
        reason: entity.reason,
        notes: entity.notes,
        totalAmount: entity.totalAmount,
        orderId: entity.orderId,
        customerId: entity.customerId,
        items: {
          create: entity.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
          })),
        },
      },
      include: { items: true },
    });
    return this.toEntity(salesReturn);
  }
async findByBranch(branchId: string): Promise<SalesReturnEntity[]> {
  const returns = await this.prisma.salesReturn.findMany({
    where: { order: { branchId } },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
  return returns.map(this.toEntity);
}
  async update(id: string, data: Partial<SalesReturnEntity>): Promise<SalesReturnEntity> {
    const salesReturn = await this.prisma.salesReturn.update({
      where: { id },
      data: { status: data.status, notes: data.notes },
      include: { items: true },
    });
    return this.toEntity(salesReturn);
  }

  private toEntity(r: SalesReturnRecord): SalesReturnEntity {
    const items = (r.items || []).map((i) =>
      new SalesReturnItemEntity(
        i.id, i.productId, toNumber(i.quantity),
        toNumber(i.unitPrice), toNumber(i.total), i.returnId,
      )
    );
    return new SalesReturnEntity(
      r.id, r.returnNumber, r.status as SalesReturnStatus,
      r.reason, r.notes, toNumber(r.totalAmount),
      r.orderId, r.customerId, items, r.createdAt,
    );
  }
}