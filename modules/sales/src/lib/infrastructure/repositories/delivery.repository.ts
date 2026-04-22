import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { IDeliveryRepository } from '../../domain/repositories/delivery.repository.interface';
import { DeliveryEntity, DeliveryStatus } from '../../domain/entities/delivery.entity';
import { DeliveryItemEntity } from '../../domain/entities/delivery-item.entity';

type NumericValue = number | string | { toString(): string };

type DeliveryItemRecord = {
  id: string;
  productId: string;
  quantity: NumericValue;
  deliveryId: string;
};

type DeliveryRecord = {
  id: string;
  deliveryNumber: string;
  status: DeliveryStatus;
  orderId: string;
  warehouseId: string;
  branchId: string;
  notes: string | null;
  deliveryDate: Date | null;
  createdAt?: Date;
  items?: DeliveryItemRecord[];
};

const toNumber = (value: NumericValue): number => Number(value);

@Injectable()
export class DeliveryRepository implements IDeliveryRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(orderId: string): Promise<DeliveryEntity[]> {
    const deliveries = await this.prisma.delivery.findMany({
      where: { orderId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return deliveries.map(this.toEntity);
  }

  async findById(id: string): Promise<DeliveryEntity | null> {
    const delivery = await this.prisma.delivery.findUnique({
      where: { id },
      include: { items: true },
    });
    return delivery ? this.toEntity(delivery) : null;
  }

  async create(entity: DeliveryEntity): Promise<DeliveryEntity> {
    const delivery = await this.prisma.delivery.create({
      data: {
        id: entity.id,
        deliveryNumber: entity.deliveryNumber,
        status: entity.status,
        orderId: entity.orderId,
        warehouseId: entity.warehouseId,
        branchId: entity.branchId,
        notes: entity.notes,
        deliveryDate: entity.deliveryDate,
        items: {
          create: entity.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });
    return this.toEntity(delivery);
  }

async findByBranch(branchId: string): Promise<DeliveryEntity[]> {
  const deliveries = await this.prisma.delivery.findMany({
    where: { branchId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
  return deliveries.map(this.toEntity);
}

  async update(id: string, data: Partial<DeliveryEntity>): Promise<DeliveryEntity> {
    const delivery = await this.prisma.delivery.update({
      where: { id },
      data: { status: data.status, notes: data.notes },
      include: { items: true },
    });
    return this.toEntity(delivery);
  }

  private toEntity(d: DeliveryRecord): DeliveryEntity {
    const items = (d.items || []).map((i) =>
      new DeliveryItemEntity(i.id, i.productId, toNumber(i.quantity), i.deliveryId)
    );
    return new DeliveryEntity(
      d.id, d.deliveryNumber, d.status as DeliveryStatus,
      d.orderId, d.warehouseId, d.branchId,
      d.notes, d.deliveryDate, items, d.createdAt,
    );
  }
}