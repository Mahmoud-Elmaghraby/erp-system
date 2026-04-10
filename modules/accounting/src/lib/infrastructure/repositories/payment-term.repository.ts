import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { IPaymentTermRepository } from '../../domain/repositories/payment-term.repository.interface';
import { PaymentTermEntity } from '../../domain/entities/payment-term.entity';

@Injectable()
export class PaymentTermRepository implements IPaymentTermRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string): Promise<PaymentTermEntity[]> {
    const terms = await this.prisma.paymentTerm.findMany({
      where: { companyId },
      include: { lines: true },
    });
    return terms.map(this.toEntity);
  }

  async findById(id: string): Promise<PaymentTermEntity | null> {
    const term = await this.prisma.paymentTerm.findUnique({
      where: { id },
      include: { lines: true },
    });
    return term ? this.toEntity(term) : null;
  }

  async create(entity: PaymentTermEntity): Promise<PaymentTermEntity> {
    const term = await this.prisma.paymentTerm.create({
      data: {
        id: entity.id,
        name: entity.name,
        companyId: entity.companyId,
        lines: {
          create: entity.lines.map(l => ({
            id: l.id,
            value: l.value,
            valueType: l.valueType,
            days: l.days,
          })),
        },
      },
      include: { lines: true },
    });
    return this.toEntity(term);
  }

  async update(id: string, data: Partial<PaymentTermEntity>): Promise<PaymentTermEntity> {
    if (data.lines) {
      await this.prisma.paymentTermLine.deleteMany({ where: { paymentTermId: id } });
    }
    const term = await this.prisma.paymentTerm.update({
      where: { id },
      data: {
        name: data.name,
        ...(data.lines && {
          lines: {
            create: data.lines.map(l => ({
              id: l.id,
              value: l.value,
              valueType: l.valueType,
              days: l.days,
            })),
          },
        }),
      },
      include: { lines: true },
    });
    return this.toEntity(term);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.paymentTermLine.deleteMany({ where: { paymentTermId: id } });
    await this.prisma.paymentTerm.delete({ where: { id } });
  }

  private toEntity(t: any): PaymentTermEntity {
    return new PaymentTermEntity(
      t.id, t.name, t.companyId,
      (t.lines || []).map((l: any) => ({
        id: l.id,
        value: Number(l.value),
        valueType: l.valueType,
        days: l.days,
      })),
    );
  }
}