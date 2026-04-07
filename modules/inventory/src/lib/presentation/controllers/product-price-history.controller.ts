import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard, PrismaService } from '@org/core';

@ApiTags('Product Price History')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('product-price-history')
export class ProductPriceHistoryController {
  constructor(private prisma: PrismaService) {}

  @Get(':productId')
  @RequirePermission('inventory.products.view')
  async findByProduct(@Param('productId') productId: string) {
    return this.prisma.productPriceHistory.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
  }
}