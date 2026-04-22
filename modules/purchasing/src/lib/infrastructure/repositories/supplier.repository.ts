import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { ISupplierRepository } from '../../domain/repositories/supplier.repository.interface';
import { SupplierEntity } from '../../domain/entities/supplier.entity';

@Injectable()
export class SupplierRepository implements ISupplierRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string): Promise<SupplierEntity[]> {
    const suppliers = await this.prisma.supplier.findMany({
      where: { isActive: true, companyId },
    });
    return suppliers.map(this.toEntity);
  }

  async findById(id: string): Promise<SupplierEntity | null> {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    return supplier ? this.toEntity(supplier) : null;
  }

  async create(entity: SupplierEntity): Promise<SupplierEntity> {
    const supplier = await this.prisma.supplier.create({
      data: {
        id: entity.id,
        name: entity.name,
        email: entity.email,
        phone: entity.phone,
        address: entity.address,
        taxRegNumber: entity.taxNumber,
        isActive: entity.isActive,
        companyId: entity.companyId,
      },
    });
    return this.toEntity(supplier);
  }

  async update(id: string, data: Partial<SupplierEntity>): Promise<SupplierEntity> {
    const supplier = await this.prisma.supplier.update({
      where: { id },
      data: { name: data.name, email: data.email, phone: data.phone, address: data.address },
    });
    return this.toEntity(supplier);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.supplier.update({ where: { id }, data: { isActive: false } });
  }

  private toEntity(s: any): SupplierEntity {
    return new SupplierEntity(
      s.id, s.name, s.email, s.phone, s.address,
      s.taxRegNumber, s.isActive, s.companyId,
    );
  }
}