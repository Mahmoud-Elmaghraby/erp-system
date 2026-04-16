import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IStockAdjustmentRepository } from '../../../domain/repositories/stock-adjustment.repository.interface';
import { STOCK_ADJUSTMENT_REPOSITORY } from '../../../domain/repositories/stock-adjustment.repository.interface';
import type { IStockMovementRepository } from '../../../domain/repositories/stock-movement.repository.interface';
import { STOCK_MOVEMENT_REPOSITORY } from '../../../domain/repositories/stock-movement.repository.interface';
import { StockMovementEntity } from '../../../domain/entities/stock-movement.entity';
import { PrismaService } from '@org/core';
import { randomUUID } from 'crypto';

@Injectable()
export class ConfirmStockAdjustmentUseCase {
  constructor(
    @Inject(STOCK_ADJUSTMENT_REPOSITORY)
    private adjustmentRepository: IStockAdjustmentRepository,
    @Inject(STOCK_MOVEMENT_REPOSITORY)
    private movementRepository: IStockMovementRepository,
    private prisma: PrismaService,
  ) {}

  async execute(id: string, companyId: string): Promise<void> {
    const adjustment = await this.adjustmentRepository.findById(id);
    if (!adjustment) throw new NotFoundException('Adjustment not found');

    adjustment.confirm();

    await this.prisma.$transaction(async () => {
      await this.adjustmentRepository.update(id, { status: 'CONFIRMED' });

      for (const item of adjustment.items) {
        if (item.difference !== 0) {
          await this.prisma.stock.upsert({
            where: { warehouseId_productId: { warehouseId: adjustment.warehouseId, productId: item.productId } },
            update: { quantity: item.actualQuantity },
            create: {
              id: randomUUID(),
              warehouseId: adjustment.warehouseId,
              productId: item.productId,
              quantity: item.actualQuantity,
            },
          });

          await this.movementRepository.create(
            StockMovementEntity.create({
              id: randomUUID(),
              type: 'ADJUSTMENT',
              quantity: Math.abs(item.difference),
              warehouseId: adjustment.warehouseId,
              productId: item.productId,
              companyId,
              reason: adjustment.reason,
              reference: id,
            }),
          );
        }
      }
    });
  }
}