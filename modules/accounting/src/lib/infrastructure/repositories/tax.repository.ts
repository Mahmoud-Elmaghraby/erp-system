import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { ITaxRepository } from '../../domain/repositories/tax.repository.interface';
import { TaxEntity, TaxScope } from '../../domain/entities/tax.entity';

@Injectable()
export class TaxRepository implements ITaxRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string): Promise<TaxEntity[]> {
    const taxes = await this.prisma.tax.findMany({
      where: { companyId, isActive: true },
    });
    return taxes.map(this.toEntity);
  }

  async findById(id: string): Promise<TaxEntity | null> {
    const tax = await this.prisma.tax.findUnique({ where: { id } });
    return tax ? this.toEntity(tax) : null;
  }

  async findByScope(companyId: string, scope: string): Promise<TaxEntity[]> {
    const taxes = await this.prisma.tax.findMany({
      where: {
        companyId,
        isActive: true,
        OR: [
          { scope: scope as TaxScope },       // ✅ cast للـ enum
          { scope: 'BOTH' as TaxScope },
        ],
      },
    });
    return taxes.map(this.toEntity);
  }

  async create(entity: TaxEntity): Promise<TaxEntity> {
    const tax = await this.prisma.tax.create({
      data: {
        id: entity.id,
        name: entity.name,
        rate: entity.rate,
        taxType: entity.taxType,             // ✅ type → taxType
        scope: entity.scope,
        isActive: entity.isActive,
        companyId: entity.companyId,
        accountId: entity.accountId,
        etaType: entity.etaType,
        etaSubtype: entity.etaSubtype,
        zatcaType: entity.zatcaType,
      },
    });
    return this.toEntity(tax);
  }

  async update(id: string, data: Partial<TaxEntity>): Promise<TaxEntity> {
    const tax = await this.prisma.tax.update({
      where: { id },
      data: {
        name: data.name,
        rate: data.rate,
        taxType: data.taxType,               // ✅ type → taxType
        scope: data.scope,
        accountId: data.accountId,
        etaType: data.etaType,
        etaSubtype: data.etaSubtype,
        zatcaType: data.zatcaType,
      },
    });
    return this.toEntity(tax);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tax.update({ where: { id }, data: { isActive: false } });
  }

  private toEntity(t: any): TaxEntity {
    return new TaxEntity(
      t.id, t.name, Number(t.rate),
      t.taxType,    // ✅ t.type → t.taxType
      t.scope, t.isActive,
      t.companyId, t.accountId,
      t.etaType, t.etaSubtype, t.zatcaType,
    );
  }
}