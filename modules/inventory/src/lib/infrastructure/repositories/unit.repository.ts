import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { IUnitRepository } from '../../domain/repositories/unit.repository.interface';
import { UnitEntity } from '../../domain/entities/unit.entity';

@Injectable()
export class UnitRepository implements IUnitRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string): Promise<UnitEntity[]> {
    const units = await this.prisma.unitOfMeasure.findMany({
      where: { companyId },
    });
    return units.map(this.toEntity);
  }

  async findById(id: string): Promise<UnitEntity | null> {
    const unit = await this.prisma.unitOfMeasure.findUnique({ where: { id } });
    return unit ? this.toEntity(unit) : null;
  }

  async create(entity: UnitEntity): Promise<UnitEntity> {
    const unit = await this.prisma.unitOfMeasure.create({
      data: {
        id: entity.id,
        name: entity.name,
        symbol: entity.symbol,
        companyId: entity.companyId,
        unitCode: entity.unitCode,
      },
    });
    return this.toEntity(unit);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.unitOfMeasure.delete({ where: { id } });
  }
async update(id: string, data: Partial<UnitEntity>): Promise<UnitEntity> {
  const unit = await this.prisma.unitOfMeasure.update({
    where: { id },
    data: { name: data.name, symbol: data.symbol, unitCode: data.unitCode },
  });
  return this.toEntity(unit);
}
  private toEntity(unit: any): UnitEntity {
    return new UnitEntity(
      unit.id, unit.name, unit.symbol,
      unit.companyId, unit.unitCode ?? null,
    );
  }
}