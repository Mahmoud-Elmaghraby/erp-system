import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { IInvoiceRepository } from '../../domain/repositories/invoice.repository.interface';
import { InvoiceEntity } from '../../domain/entities/invoice.entity';

@Injectable()
export class InvoiceRepository implements IInvoiceRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(orderId: string): Promise<InvoiceEntity[]> {
    const invoices = await this.prisma.invoice.findMany({ where: { orderId } });
    return invoices.map(this.toEntity);
  }

  async findById(id: string): Promise<InvoiceEntity | null> {
    const invoice = await this.prisma.invoice.findUnique({ where: { id } });
    return invoice ? this.toEntity(invoice) : null;
  }

  async create(entity: InvoiceEntity): Promise<InvoiceEntity> {
    const invoice = await this.prisma.invoice.create({
      data: {
        id: entity.id,
        invoiceNumber: entity.invoiceNumber,
        status: entity.status,
        totalAmount: entity.totalAmount,
        paidAmount: entity.paidAmount,
        orderId: entity.orderId,
        dueDate: entity.dueDate,
      },
    });
    return this.toEntity(invoice);
  }

  async update(id: string, data: Partial<InvoiceEntity>): Promise<InvoiceEntity> {
    const invoice = await this.prisma.invoice.update({
      where: { id },
      data: { status: data.status, paidAmount: data.paidAmount },
    });
    return this.toEntity(invoice);
  }

  private toEntity(i: any): InvoiceEntity {
    return new InvoiceEntity(
      i.id, i.invoiceNumber, i.status,
      Number(i.totalAmount), Number(i.paidAmount),
      i.orderId, i.dueDate,
    );
  }
}