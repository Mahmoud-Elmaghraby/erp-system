import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { IOrderRepository } from '../../domain/repositories/order.repository.interface';
import { OrderEntity } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';

type NumericValue = number | string | { toString(): string };

type OrderItemRecord = {
  id: string;
  orderId: string;
  productId: string;
  quantity: NumericValue;
  unitPrice: NumericValue;
  total: NumericValue;
};

type OrderRecord = {
  id: string;
  orderNumber: string;
  status: OrderEntity['status'];
  branchId: string;
  customerId: string | null;
  notes: string | null;
  totalAmount: NumericValue;
  items?: OrderItemRecord[];
};

const toNumber = (value: NumericValue): number => Number(value);

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string): Promise<OrderEntity[]> {
    const branches = await this.prisma.branch.findMany({
      where: { companyId },
      select: { id: true },
    });
    const branchIds = branches.map(b => b.id);

    const orders = await this.prisma.salesOrder.findMany({
      where: { branchId: { in: branchIds } },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    // إصلاح مشكلة الـ scope الخاصة بـ this
    return orders.map((order) => this.toEntity(order));
  }

  async findById(id: string): Promise<OrderEntity | null> {
    const order = await this.prisma.salesOrder.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    return order ? this.toEntity(order) : null;
  }

  async create(entity: OrderEntity): Promise<OrderEntity> {
    const order = await this.prisma.salesOrder.create({
      data: {
        id: entity.id,
        orderNumber: entity.orderNumber,
        status: entity.status,
        branchId: entity.branchId,
        customerId: entity.customerId,
        notes: entity.notes,
        totalAmount: entity.totalAmount,
        items: {
          create: entity.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.unitPrice * item.quantity,
            total: item.total,
          })),
        },
      },
      include: { items: true },
    });
    
    return this.toEntity(order);
  }

  async update(id: string, data: Partial<OrderEntity>): Promise<OrderEntity> {
    const order = await this.prisma.salesOrder.update({
      where: { id },
      data: { status: data.status, totalAmount: data.totalAmount },
      include: { items: true },
    });
    
    return this.toEntity(order);
  }

  private toEntity(o: OrderRecord): OrderEntity {
    const items = (o.items || []).map((i) =>
      new OrderItem(
        i.id,
        i.orderId,
        i.productId,
        toNumber(i.quantity),
        toNumber(i.unitPrice),
        toNumber(i.total)
      )
    );

    // تم حذف جملة الـ return المكررة
    return new OrderEntity(
      o.id,
      o.orderNumber,
      o.status,
      o.branchId,
      o.customerId,
      o.notes,
      toNumber(o.totalAmount),
      items
    );
  }
}