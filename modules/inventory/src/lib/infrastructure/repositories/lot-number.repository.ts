import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { ILotNumberRepository } from '../../domain/repositories/lot-number.repository.interface';
import { LotNumberEntity } from '../../domain/entities/lot-number.entity';

@Injectable()
export class LotNumberRepository implements ILotNumberRepository {
  constructor(private prisma: PrismaService) {}

  async findByProduct(productId: string, warehouseId?: string): Promise<LotNumberEntity[]> {
    const lots = await this.prisma.lotNumber.findMany({
      where: { productId, ...(warehouseId && { warehouseId }) },
      include: {
        product: { select: { id: true, name: true } },
        warehouse: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return lots.map(this.toEntity);
  }

  async findByLotNumber(lotNumber: string): Promise<LotNumberEntity | null> {
    const lot = await this.prisma.lotNumber.findFirst({ where: { lotNumber } });
    return lot ? this.toEntity(lot) : null;
  }

  async create(entity: LotNumberEntity): Promise<LotNumberEntity> {
    const lot = await this.prisma.lotNumber.create({
      data: {
        id: entity.id,
        lotNumber: entity.lotNumber,
        productId: entity.productId,
        warehouseId: entity.warehouseId,
        quantity: entity.quantity,
        notes: entity.notes,
      },
    });
    return this.toEntity(lot);
  }

  async updateQuantity(id: string, quantity: number): Promise<LotNumberEntity> {
    const lot = await this.prisma.lotNumber.update({
      where: { id },
      data: { quantity },
    });
    return this.toEntity(lot);
  }

  private toEntity(l: any): LotNumberEntity {
    return new LotNumberEntity(
      l.id, l.lotNumber, l.productId, l.warehouseId,
      Number(l.quantity), l.receivedDate, l.notes,
    );
  }
}