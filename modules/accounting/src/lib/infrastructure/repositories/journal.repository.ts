import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { IJournalRepository } from '../../domain/repositories/journal.repository.interface';
import { JournalEntity, JournalType } from '../../domain/entities/journal.entity';

@Injectable()
export class JournalRepository implements IJournalRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string): Promise<JournalEntity[]> {
    const journals = await this.prisma.journal.findMany({ where: { companyId } });
    return journals.map(this.toEntity);
  }

  async findById(id: string): Promise<JournalEntity | null> {
    const journal = await this.prisma.journal.findUnique({ where: { id } });
    return journal ? this.toEntity(journal) : null;
  }

  async findByType(companyId: string, type: string): Promise<JournalEntity | null> {
    const journal = await this.prisma.journal.findFirst({
      where: { companyId, type: type as JournalType },
    });
    return journal ? this.toEntity(journal) : null;
  }

  async create(entity: JournalEntity): Promise<JournalEntity> {
    const journal = await this.prisma.journal.create({
      data: {
        id: entity.id,
        name: entity.name,
        type: entity.type,
        companyId: entity.companyId,
      },
    });
    return this.toEntity(journal);
  }

  async update(id: string, data: Partial<JournalEntity>): Promise<JournalEntity> {
    const journal = await this.prisma.journal.update({
      where: { id },
      data: { name: data.name, type: data.type },
    });
    return this.toEntity(journal);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.journal.delete({ where: { id } });
  }

  private toEntity(j: any): JournalEntity {
    return new JournalEntity(j.id, j.name, j.type, j.companyId);
  }
}