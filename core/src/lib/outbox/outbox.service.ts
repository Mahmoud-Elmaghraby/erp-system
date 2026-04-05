import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OutboxService {
  constructor(private prisma: PrismaService) {}

  async publish(eventType: string, payload: object, tx?: any): Promise<void> {
    const client = tx || this.prisma;
    await client.outboxEvent.create({
      data: {
        eventType,
        payload,
        status: 'PENDING',
      },
    });
  }

  async getPendingEvents() {
    return this.prisma.outboxEvent.findMany({
      where: { status: 'PENDING', attempts: { lt: 5 } },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });
  }

  async markAsProcessed(id: string): Promise<void> {
    await this.prisma.outboxEvent.update({
      where: { id },
      data: { status: 'PROCESSED', processedAt: new Date() },
    });
  }

  async markAsFailed(id: string): Promise<void> {
    await this.prisma.outboxEvent.update({
      where: { id },
      data: { status: 'FAILED', attempts: { increment: 1 } },
    });
  }

  async incrementAttempts(id: string): Promise<void> {
    await this.prisma.outboxEvent.update({
      where: { id },
      data: { attempts: { increment: 1 } },
    });
  }
}