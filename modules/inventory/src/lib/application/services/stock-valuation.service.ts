import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';

@Injectable()
export class StockValuationService {
  constructor(private prisma: PrismaService) {}

  async getStockValue(companyId: string, warehouseId?: string) {
    const stocks = await this.prisma.stock.findMany({
      where: {
        warehouse: { companyId },
        ...(warehouseId && { warehouseId }),
      },
      include: {
        product: { select: { id: true, name: true, price: true, cost: true } },
        warehouse: { select: { id: true, name: true } },
      },
    });

    const items = stocks.map(s => ({
      productId: s.productId,
      productName: s.product.name,
      warehouseId: s.warehouseId,
      warehouseName: s.warehouse.name,
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