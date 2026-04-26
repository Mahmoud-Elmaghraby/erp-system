import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import { IPriceListRepository } from '../../domain/repositories/price-list.repository.interface';
import { PriceListEntity, PriceListItemEntity } from '../../domain/entities/price-list.entity';

@Injectable()
export class PriceListRepository implements IPriceListRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string): Promise<PriceListEntity[]> {
    const lists = await this.prisma.priceList.findMany({
      where: { companyId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return lists.map(l => this.toEntity(l));
  }

  async findById(id: string, companyId: string): Promise<PriceListEntity | null> {
    const list = await this.prisma.priceList.findFirst({
      where: { id, companyId },
      include: { items: true },
    });
    return list ? this.toEntity(list) : null;
  }

  async create(data: Omit<PriceListEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<PriceListEntity> {
    const list = await this.prisma.priceList.create({
      data: {
        name: data.name,
        status: data.status,
        companyId: data.companyId,
        items: {
          create: data.items.map(i => ({
            productId: i.productId,
            defaultPrice: i.defaultPrice,
            customPrice: i.customPrice,
          })),
        },
      },
      include: { items: true },
    });
    return this.toEntity(list);
  }

  async update(id: string, companyId: string, data: Partial<PriceListEntity>): Promise<PriceListEntity> {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.status !== undefined) updateData.status = data.status;

    await this.prisma.priceList.update({
      where: { id },
      data: updateData,
      include: { items: true },
    });

    // Handle items if provided (basic replacement approach for simplicity, or we could diff)
    if (data.items && data.items.length > 0) {
      await this.prisma.priceListItem.deleteMany({ where: { priceListId: id } });
      await this.prisma.priceListItem.createMany({
        data: data.items.map(i => ({
          priceListId: id,
          productId: i.productId,
          defaultPrice: i.defaultPrice,
          customPrice: i.customPrice,
        })),
      });
    }

    const updated = await this.prisma.priceList.findUnique({
      where: { id },
      include: { items: true },
    });
    return this.toEntity(updated as any);
  }

  async delete(id: string, companyId: string): Promise<void> {
    // Delete items first if cascade is not trusted, but prisma cascade will handle it
    await this.prisma.priceList.delete({
      where: { id },
    });
  }

  async addItemToPriceList(priceListId: string, productId: string, customPrice: number, defaultPrice: number): Promise<void> {
    await this.prisma.priceListItem.upsert({
      where: {
        priceListId_productId: {
          priceListId,
          productId,
        },
      },
      update: {
        customPrice,
        defaultPrice,
      },
      create: {
        priceListId,
        productId,
        customPrice,
        defaultPrice,
      },
    });
  }

  async removeItemFromPriceList(priceListId: string, productId: string): Promise<void> {
    await this.prisma.priceListItem.delete({
      where: {
        priceListId_productId: {
          priceListId,
          productId,
        },
      },
    });
  }

  async findItemsByPriceListId(priceListId: string): Promise<PriceListItemEntity[]> {
    const items = await this.prisma.priceListItem.findMany({
      where: { priceListId },
      include: { product: { select: { id: true, name: true, sku: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return items.map((i: any) => new PriceListItemEntity(
      i.id,
      i.priceListId,
      i.productId,
      Number(i.defaultPrice),
      Number(i.customPrice),
    ));
  }

  async upsertItems(
    priceListId: string,
    items: { productId: string; customPrice: number; defaultPrice: number }[],
  ): Promise<number> {
    const operations = items.map((item) =>
      this.prisma.priceListItem.upsert({
        where: {
          priceListId_productId: {
            priceListId,
            productId: item.productId,
          },
        },
        update: {
          customPrice: item.customPrice,
          defaultPrice: item.defaultPrice,
        },
        create: {
          priceListId,
          productId: item.productId,
          customPrice: item.customPrice,
          defaultPrice: item.defaultPrice,
        },
      }),
    );
    const results = await this.prisma.$transaction(operations);
    return results.length;
  }

  private toEntity(record: any): PriceListEntity {
    return new PriceListEntity(
      record.id,
      record.companyId,
      record.name,
      record.status,
      record.items?.map((i: any) => new PriceListItemEntity(
        i.id,
        i.priceListId,
        i.productId,
        Number(i.defaultPrice),
        Number(i.customPrice)
      )) || [],
      record.createdAt,
      record.updatedAt,
    );
  }
}
