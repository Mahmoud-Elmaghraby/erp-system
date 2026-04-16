import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { IQuotationRepository } from '../../domain/repositories/quotation.repository.interface';
import { QuotationEntity, QuotationStatus } from '../../domain/entities/quotation.entity';
import { QuotationItemEntity } from '../../domain/entities/quotation-item.entity';

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

  private toEntity(q: any): QuotationEntity {
    const items = (q.items || []).map((i: any) =>
      new QuotationItemEntity(
        i.id, i.productId,
        Number(i.quantity), Number(i.unitPrice),
        Number(i.discount), Number(i.subtotal),
        Number(i.taxAmount), Number(i.total),
        i.taxId, i.quotationId,
      )
    );
    return new QuotationEntity(
      q.id, q.quotationNumber, q.status as QuotationStatus,
      q.branchId, q.customerId, q.notes, q.validUntil,
      Number(q.untaxedAmount), Number(q.taxAmount),
      Number(q.totalAmount), Number(q.discountAmount),
      q.currency, Number(q.exchangeRate),
      q.paymentTermId, items, q.createdAt,
    );
  }
}