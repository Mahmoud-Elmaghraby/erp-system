import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { IInvoiceRepository } from '../../domain/repositories/invoice.repository.interface';
import { InvoiceEntity } from '../../domain/entities/invoice.entity';

@Injectable()
export class InvoiceRepository implements IInvoiceRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(orderId: string): Promise<InvoiceEntity[]> {
    const invoices = await this.prisma.invoice.findMany({
      where: { orderId },
      include: { paymentTerm: true },
      orderBy: { dateTimeIssued: 'desc' },
    });
    return invoices.map(this.toEntity);
  }

  async findById(id: string): Promise<InvoiceEntity | null> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: { paymentTerm: true, order: true },
    });
    return invoice ? this.toEntity(invoice) : null;
  }


async findByBranch(branchId: string): Promise<InvoiceEntity[]> {
  const invoices = await this.prisma.invoice.findMany({
    where: { order: { branchId } },
    include: { paymentTerm: true },
    orderBy: { dateTimeIssued: 'desc' },
  });
  return invoices.map(this.toEntity);
}

  async findByCompany(companyId: string): Promise<InvoiceEntity[]> {
  const invoices = await this.prisma.invoice.findMany({
    where: {
      order: {
        branchId: {
          in: await this.prisma.branch.findMany({
            where: { companyId },
            select: { id: true },
          }).then(branches => branches.map(b => b.id)),
        },
      },
    },
    include: { paymentTerm: true },
    orderBy: { dateTimeIssued: 'desc' },
  });
  return invoices.map(this.toEntity);
}

  async create(entity: InvoiceEntity): Promise<InvoiceEntity> {
    const invoice = await this.prisma.invoice.create({
      data: {
        id: entity.id,
        invoiceNumber: entity.invoiceNumber,
        status: entity.status,
        untaxedAmount: entity.untaxedAmount,
        taxAmount: entity.taxAmount,
        totalAmount: entity.totalAmount,
        paidAmount: entity.paidAmount,
        discountAmount: entity.discountAmount,
        currency: entity.currency,
        exchangeRate: entity.exchangeRate,
        orderId: entity.orderId,
        dueDate: entity.dueDate,
        paymentTermId: entity.paymentTermId,
        dateTimeIssued: entity.dateTimeIssued,
      },
    });
    return this.toEntity(invoice);
  }

  async update(id: string, data: Partial<InvoiceEntity>): Promise<InvoiceEntity> {
    const invoice = await this.prisma.invoice.update({
      where: { id },
      data: {
        status: data.status,
        paidAmount: data.paidAmount,
        etaStatus: data.etaStatus,
        etaUUID: data.etaUUID,
        zatcaStatus: data.zatcaStatus,
        qrCode: data.qrCode,
      },
    });
    return this.toEntity(invoice);
  }

  private toEntity(i: any): InvoiceEntity {
    return new InvoiceEntity(
      i.id,
      i.invoiceNumber,
      i.status,
      Number(i.untaxedAmount),
      Number(i.taxAmount),
      Number(i.totalAmount),
      Number(i.paidAmount),
      Number(i.discountAmount),
      i.currency,
      Number(i.exchangeRate),
      i.orderId,
      i.dueDate,
      i.paymentTermId,
      i.uuid,
      i.dateTimeIssued,
      i.etaStatus,
      i.etaUUID,
      i.zatcaStatus,
      i.qrCode,
    );
  }
}