import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import { CustomerEntity } from '../../domain/entities/customer.entity';

type CustomerRecord = {
  id: string;
  code: string;
  name: string;
  email: string | null;
  phone: string | null;
  nationalId: string | null;
  taxNumber: string | null;
  address: string | null;
  isActive: boolean;
  companyId: string;
  country: string | null;
  buyerType: string | null;
};

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string): Promise<CustomerEntity[]> {
    const customers = await this.prisma.customer.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
    return (customers as CustomerRecord[]).map((customer) => this.toEntity(customer));
  }

  async findById(id: string): Promise<CustomerEntity | null> {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    return customer ? this.toEntity(customer as CustomerRecord) : null;
  }

  async create(entity: CustomerEntity): Promise<CustomerEntity> {
    const customer = await (this.prisma.customer as any).create({
      data: {
        id: entity.id,
        code: entity.code,
        name: entity.name,
        email: entity.email,
        phone: entity.phone,
        nationalId: entity.nationalId,
        taxNumber: entity.taxNumber,
        address: entity.address,
        isActive: entity.status === 'inactive' ? false : entity.isActive,
        companyId: entity.companyId,
        country: entity.country,
        buyerType: entity.buyerType,
      },
    });
    return this.toEntity(customer as CustomerRecord);
  }

  async update(id: string, data: Partial<CustomerEntity>): Promise<CustomerEntity> {
    const customer = await (this.prisma.customer as any).update({
      where: { id },
      data: {
        code: data.code,
        name: data.name,
        email: data.email,
        phone: data.phone,
        nationalId: data.nationalId,
        taxNumber: data.taxNumber,
        address: data.address,
        isActive: data.status ? data.status === 'active' : data.isActive,
        country: data.country,
        buyerType: data.buyerType,
      },
    });
    return this.toEntity(customer as CustomerRecord);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customer.update({ where: { id }, data: { isActive: false } });
  }

  private toEntity(c: CustomerRecord): CustomerEntity {
    return new CustomerEntity(
      c.id,
      c.code,
      c.name,
      c.email,
      c.phone,
      c.nationalId ?? null,
      c.taxNumber ?? null,
      c.address,
      c.isActive,
      c.companyId,
      c.country ?? 'EG',
      c.buyerType ?? 'B',
      c.isActive ? 'active' : 'inactive',
    );
  }
}