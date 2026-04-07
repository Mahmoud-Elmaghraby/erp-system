import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import { IWarehouseRepository } from '../../domain/repositories/warehouse.repository.interface';
import { WarehouseEntity } from '../../domain/entities/warehouse.entity';

@Injectable()
export class WarehouseRepository implements IWarehouseRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(branchId: string): Promise<WarehouseEntity[]> {
    const where = branchId ? { branchId, isActive: true } : { isActive: true };
    const warehouses = await this.prisma.warehouse.findMany({ where });
    return warehouses.map(this.toEntity);
  }

  async findById(id: string): Promise<WarehouseEntity | null> {
    const warehouse = await this.prisma.warehouse.findUnique({ where: { id } });
    return warehouse ? this.toEntity(warehouse) : null;
  }

  async create(entity: WarehouseEntity): Promise<WarehouseEntity> {
    const warehouse = await this.prisma.warehouse.create({
      data: {
        id: entity.id,
        name: entity.name,
        address: entity.address,
        isActive: entity.isActive,
        branchId: entity.branchId || await this.getDefaultBranchId(),
      },
    });
    return this.toEntity(warehouse);
  }

  async update(id: string, data: Partial<WarehouseEntity>): Promise<WarehouseEntity> {
    const warehouse = await this.prisma.warehouse.update({
      where: { id },
      data: { name: data.name, address: data.address },
    });
    return this.toEntity(warehouse);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.warehouse.update({ where: { id }, data: { isActive: false } });
  }

  private async getDefaultBranchId(): Promise<string> {
    const branch = await this.prisma.branch.findFirst();
    if (!branch) throw new Error('No branch found');
    return branch.id;
  }

  private toEntity(warehouse: any): WarehouseEntity {
    return new WarehouseEntity(
      warehouse.id,
      warehouse.name,
      warehouse.address,
      warehouse.branchId,
      warehouse.isActive,
    );
  }
}