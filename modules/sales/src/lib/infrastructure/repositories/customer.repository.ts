import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import { CustomerEntity } from '../../domain/entities/customer.entity';

type CustomerRecord = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  isActive: boolean;
  companyId: string;
  taxRegNumber: string | null;
  commercialReg: string | null;
  country: string | null;
  buyerType: string | null;
};

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string): Promise<CustomerEntity[]> {
    const customers = await this.prisma.customer.findMany({
      where: { isActive: true, companyId },
      orderBy: { createdAt: 'desc' },
    });
    return customers.map(this.toEntity);
  }

  async findById(id: string): Promise<CustomerEntity | null> {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    return customer ? this.toEntity(customer) : null;
  }

  async create(entity: CustomerEntity): Promise<CustomerEntity> {
    const customer = await this.prisma.customer.create({
      data: {
        id: entity.id,
        name: entity.name,
        email: entity.email,
        phone: entity.phone,
        address: entity.address,
        isActive: entity.isActive,
        companyId: entity.companyId,
        taxRegNumber: entity.taxRegNumber,
        commercialReg: entity.commercialReg,
        country: entity.country,
        buyerType: entity.buyerType,
      },
    });
    return this.toEntity(customer);
  }

  async update(id: string, data: Partial<CustomerEntity>): Promise<CustomerEntity> {
    const customer = await this.prisma.customer.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        taxRegNumber: data.taxRegNumber,
        commercialReg: data.commercialReg,
        country: data.country,
        buyerType: data.buyerType,
      },
    });
    return this.toEntity(customer);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customer.update({ where: { id }, data: { isActive: false } });
  }

  private toEntity(c: CustomerRecord): CustomerEntity {
    return new CustomerEntity(
      c.id, c.name, c.email, c.phone, c.address,
      c.isActive, c.companyId,
      c.taxRegNumber ?? null,
      c.commercialReg ?? null,
      c.country ?? 'EG',
      c.buyerType ?? 'B',
    );
  }
}