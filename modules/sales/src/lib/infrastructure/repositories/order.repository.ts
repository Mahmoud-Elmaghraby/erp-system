import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { IOrderRepository } from '../../domain/repositories/order.repository.interface';
import { OrderEntity } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(branchId: string): Promise<OrderEntity[]> {
    const orders = await this.prisma.salesOrder.findMany({
      where: { branchId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map(this.toEntity);
  }

  async findById(id: string): Promise<OrderEntity | null> {
    const order = await this.prisma.salesOrder.findUnique({
      where: { id },
      include: { items: true, customer: true },
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
            subtotal: item.unitPrice * item.quantity, // ✅ مضاف
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

  private toEntity(o: any): OrderEntity {
    const order = new OrderEntity(
      o.id, o.orderNumber, o.status, o.branchId,
      o.customerId, o.notes, Number(o.totalAmount), [],
    );
    order.items = (o.items || []).map((i: any) =>
      new OrderItem(
        i.id, i.orderId, i.productId,
        Number(i.quantity), Number(i.unitPrice), Number(i.total)
      )
    );
    return order;
  }
}