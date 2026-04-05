import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import { IStockRepository } from '../../domain/repositories/stock.repository.interface';
import { StockEntity } from '../../domain/entities/stock.entity';
import { Quantity } from '../../domain/value-objects/quantity.vo';
import { randomUUID } from 'crypto';

@Injectable()
export class StockRepository implements IStockRepository {
  constructor(private prisma: PrismaService) {}

  async findByWarehouse(warehouseId: string): Promise<StockEntity[]> {
    const stocks = await this.prisma.stock.findMany({ where: { warehouseId } });
    return stocks.map(this.toEntity);
  }

  async findByWarehouseAndProduct(warehouseId: string, productId: string): Promise<StockEntity | null> {
    const stock = await this.prisma.stock.findUnique({
      where: { warehouseId_productId: { warehouseId, productId } },
    });
    return stock ? this.toEntity(stock) : null;
  }

  async upsert(warehouseId: string, productId: string, quantity: number): Promise<StockEntity> {
    const stock = await this.prisma.stock.upsert({
      where: { warehouseId_productId: { warehouseId, productId } },
      update: { quantity: { increment: quantity } },
      create: { id: randomUUID(), warehouseId, productId, quantity },
    });
    return this.toEntity(stock);
  }

  async update(id: string, quantity: number): Promise<StockEntity> {
    const stock = await this.prisma.stock.update({
      where: { id },
      data: { quantity },
    });
    return this.toEntity(stock);
  }

  private toEntity(stock: any): StockEntity {
    return new StockEntity(
      stock.id,
      stock.warehouseId,
      stock.productId,
      Quantity.create(Number(stock.quantity)),
      Quantity.create(Number(stock.minStock)),
    );
  }
}