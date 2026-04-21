import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { IQuotationRepository } from '../../domain/repositories/quotation.repository.interface';
import { QuotationEntity, QuotationStatus } from '../../domain/entities/quotation.entity';
import { QuotationItemEntity } from '../../domain/entities/quotation-item.entity';

type NumericValue = number | string | { toString(): string };

type QuotationItemRecord = {
  id: string;
  productId: string;
  quantity: NumericValue;
  unitPrice: NumericValue;
  discount: NumericValue;
  subtotal: NumericValue;
  taxAmount: NumericValue;
  total: NumericValue;
  taxId: string | null;
  quotationId: string;
};

type QuotationRecord = {
  id: string;
  quotationNumber: string;
  status: QuotationStatus;
  branchId: string;
  customerId: string | null;
  notes: string | null;
  validUntil: Date | null;
  untaxedAmount: NumericValue;
  taxAmount: NumericValue;
  totalAmount: NumericValue;
  discountAmount: NumericValue;
  currency: string;
  exchangeRate: NumericValue;
  paymentTermId: string | null;
  createdAt?: Date;
  items?: QuotationItemRecord[];
};

const toNumber = (value: NumericValue): number => Number(value);

@Injectable()
export class QuotationRepository implements IQuotationRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(branchId: string): Promise<QuotationEntity[]> {
    const quotations = await this.prisma.salesQuotation.findMany({
      where: { branchId },
      include: { items: true, customer: true },
      orderBy: { createdAt: 'desc' },
    });
    return quotations.map(this.toEntity);
  }

  async findById(id: string): Promise<QuotationEntity | null> {
    const quotation = await this.prisma.salesQuotation.findUnique({
      where: { id },
      include: { items: true, customer: true, paymentTerm: true },
    });
    return quotation ? this.toEntity(quotation) : null;
  }

  async create(entity: QuotationEntity): Promise<QuotationEntity> {
    const quotation = await this.prisma.salesQuotation.create({
      data: {
        id: entity.id,
        quotationNumber: entity.quotationNumber,
        status: entity.status,
        branchId: entity.branchId,
        customerId: entity.customerId,
        notes: entity.notes,
        validUntil: entity.validUntil,
        untaxedAmount: entity.untaxedAmount,
        taxAmount: entity.taxAmount,
        totalAmount: entity.totalAmount,
        discountAmount: entity.discountAmount,
        currency: entity.currency,
        exchangeRate: entity.exchangeRate,
        paymentTermId: entity.paymentTermId,
        items: {
          create: entity.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            subtotal: item.subtotal,
            taxAmount: item.taxAmount,
            total: item.total,
            taxId: item.taxId,
          })),
        },
      },
      include: { items: true },
    });
    return this.toEntity(quotation);
  }

  async update(id: string, data: Partial<QuotationEntity>): Promise<QuotationEntity> {
    const quotation = await this.prisma.salesQuotation.update({
      where: { id },
      data: {
        status: data.status,
        notes: data.notes,
        validUntil: data.validUntil,
        discountAmount: data.discountAmount,
      },
      include: { items: true },
    });
    return this.toEntity(quotation);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.salesQuotation.delete({ where: { id } });
  }

  private toEntity(q: QuotationRecord): QuotationEntity {
    const items = (q.items || []).map((i) =>
      new QuotationItemEntity(
        i.id, i.productId,
        toNumber(i.quantity), toNumber(i.unitPrice),
        toNumber(i.discount), toNumber(i.subtotal),
        toNumber(i.taxAmount), toNumber(i.total),
        i.taxId, i.quotationId,
      )
    );
    return new QuotationEntity(
      q.id, q.quotationNumber, q.status as QuotationStatus,
      q.branchId, q.customerId, q.notes, q.validUntil,
      toNumber(q.untaxedAmount), toNumber(q.taxAmount),
      toNumber(q.totalAmount), toNumber(q.discountAmount),
      q.currency, toNumber(q.exchangeRate),
      q.paymentTermId, items, q.createdAt,
    );
  }
}