import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import { IWarehouseRepository } from '../../domain/repositories/warehouse.repository.interface';
import { WarehouseEntity } from '../../domain/entities/warehouse.entity';

@Injectable()
export class WarehouseRepository implements IWarehouseRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string): Promise<WarehouseEntity[]> {
    const warehouses = await this.prisma.warehouse.findMany({
      where: { companyId },
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
    });
    return warehouses.map(this.toEntity);
  }

  async findById(id: string): Promise<WarehouseEntity | null> {
    const warehouse = await this.prisma.warehouse.findUnique({ where: { id } });
    return warehouse ? this.toEntity(warehouse) : null;
  }

  async create(entity: WarehouseEntity): Promise<WarehouseEntity> {
    // If this warehouse is primary, unset primary on all others in the same company
    if (entity.isPrimary) {
      await this.prisma.warehouse.updateMany({
        where: { companyId: entity.companyId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const warehouse = await this.prisma.warehouse.create({
      data: {
        id: entity.id,
        name: entity.name,
        address: entity.address,
        isActive: entity.isActive,
        isPrimary: entity.isPrimary,
        permissions: entity.permissions ? (entity.permissions as any) : undefined,
        branchId: entity.branchId,
        companyId: entity.companyId,
      },
    });
    return this.toEntity(warehouse);
  }

  async update(id: string, data: Partial<WarehouseEntity>): Promise<WarehouseEntity> {
    // If setting as primary, unset primary on all others in the same company
    if (data.isPrimary) {
      const existing = await this.prisma.warehouse.findUnique({ where: { id } });
      if (existing) {
        await this.prisma.warehouse.updateMany({
          where: { companyId: existing.companyId, isPrimary: true },
          data: { isPrimary: false },
        });
      }
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.isPrimary !== undefined) updateData.isPrimary = data.isPrimary;
    if (data.permissions !== undefined) updateData.permissions = data.permissions as any;

    const warehouse = await this.prisma.warehouse.update({
      where: { id },
      data: updateData,
    });
    return this.toEntity(warehouse);
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.warehouse.delete({ where: { id } });
    } catch (error: any) {
      // FK constraint — warehouse has related stock/movements, soft-delete instead
      if (error?.code === 'P2003' || error?.code === 'P2014') {
        await this.prisma.warehouse.update({ where: { id }, data: { isActive: false } });
      } else {
        throw error;
      }
    }
  }

  private toEntity(w: any): WarehouseEntity {
    return new WarehouseEntity(
      w.id, w.name, w.address, w.branchId, w.companyId,
      w.isActive, w.isPrimary, w.permissions,
    );
  }
}