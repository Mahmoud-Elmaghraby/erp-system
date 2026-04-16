import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { ISerialNumberRepository } from '../../domain/repositories/serial-number.repository.interface';
import { SerialNumberEntity, SerialNumberStatus } from '../../domain/entities/serial-number.entity';

@Injectable()
export class SerialNumberRepository implements ISerialNumberRepository {
  constructor(private prisma: PrismaService) {}

  async findByProduct(productId: string, warehouseId?: string): Promise<SerialNumberEntity[]> {
    const serials = await this.prisma.serialNumber.findMany({
      where: { productId, ...(warehouseId && { warehouseId }) },
      include: {
        product: { select: { id: true, name: true } },
        warehouse: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return serials.map(this.toEntity);
  }

  async findBySerialNumber(serialNumber: string): Promise<SerialNumberEntity | null> {
    const serial = await this.prisma.serialNumber.findUnique({ where: { serialNumber } });
    return serial ? this.toEntity(serial) : null;
  }

  async findByStatus(status: SerialNumberStatus, warehouseId?: string): Promise<SerialNumberEntity[]> {
    const serials = await this.prisma.serialNumber.findMany({
where: { status: status as any, ...(warehouseId && { warehouseId }) },      include: {
        product: { select: { id: true, name: true } },
        warehouse: { select: { id: true, name: true } },
      },
    });
    return serials.map(this.toEntity);
  }

  async createMany(entities: SerialNumberEntity[]): Promise<SerialNumberEntity[]> {
    await this.prisma.serialNumber.createMany({
      data: entities.map(e => ({
        id: e.id,
        serialNumber: e.serialNumber,
        productId: e.productId,
        warehouseId: e.warehouseId,
        status: e.status as any,
        notes: e.notes,
      })),
    });
    return entities;
  }

  async updateStatus(id: string, status: SerialNumberStatus): Promise<SerialNumberEntity> {
    const serial = await this.prisma.serialNumber.update({
      where: { id },
      data: { status: status as any },
    });
    return this.toEntity(serial);
  }

  private toEntity(s: any): SerialNumberEntity {
    return new SerialNumberEntity(
      s.id, s.serialNumber, s.productId, s.warehouseId,
      s.status as SerialNumberStatus, s.notes,
    );
  }
}