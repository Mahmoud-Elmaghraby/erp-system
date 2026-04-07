import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';

@Injectable()
export class StockValuationService {
  constructor(private prisma: PrismaService) {}

  async getStockValue(warehouseId?: string): Promise<{
    totalValue: number;
    totalCost: number;
    items: Array<{
      productId: string;
      productName: string;
      quantity: number;
      unitCost: number;
      unitPrice: number;
      totalCost: number;
      totalValue: number;
    }>;
  }> {
    const stocks = await this.prisma.stock.findMany({
      where: warehouseId ? { warehouseId } : {},
      include: {
        product: {
          select: { id: true, name: true, price: true, cost: true },
        },
      },
    });

    const items = stocks.map(s => ({
      productId: s.productId,
      productName: s.product.name,
      quantity: Number(s.quantity),
      unitCost: Number(s.product.cost),
      unitPrice: Number(s.product.price),
      totalCost: Number(s.quantity) * Number(s.product.cost),
      totalValue: Number(s.quantity) * Number(s.product.price),
    }));

    return {
      totalValue: items.reduce((sum, i) => sum + i.totalValue, 0),
      totalCost: items.reduce((sum, i) => sum + i.totalCost, 0),
      items,
    };
  }
}