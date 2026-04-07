import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import { CustomerEntity } from '../../domain/entities/customer.entity';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<CustomerEntity[]> {
    const customers = await this.prisma.customer.findMany({ where: { isActive: true } });
    return customers.map(this.toEntity);
  }

  async findById(id: string): Promise<CustomerEntity | null> {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    return customer ? this.toEntity(customer) : null;
  }

  async create(entity: CustomerEntity): Promise<CustomerEntity> {
    const customer = await this.prisma.customer.create({
      data: {
        id: entity.id, name: entity.name, email: entity.email,
        phone: entity.phone, address: entity.address, isActive: entity.isActive,
      },
    });
    return this.toEntity(customer);
  }

  async update(id: string, data: Partial<CustomerEntity>): Promise<CustomerEntity> {
    const customer = await this.prisma.customer.update({
      where: { id },
      data: { name: data.name, email: data.email, phone: data.phone, address: data.address },
    });
    return this.toEntity(customer);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customer.update({ where: { id }, data: { isActive: false } });
  }

  private toEntity(c: any): CustomerEntity {
    return new CustomerEntity(c.id, c.name, c.email, c.phone, c.address, c.isActive);
  }
}