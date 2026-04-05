import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { ICategoryRepository } from '../../domain/repositories/category.repository.interface';
import { CategoryEntity } from '../../domain/entities/category.entity';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<CategoryEntity[]> {
    const categories = await this.prisma.category.findMany();
    return categories.map(this.toEntity);
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    return category ? this.toEntity(category) : null;
  }

  async create(entity: CategoryEntity): Promise<CategoryEntity> {
    const category = await this.prisma.category.create({
      data: { id: entity.id, name: entity.name, parentId: entity.parentId },
    });
    return this.toEntity(category);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }

  private toEntity(category: any): CategoryEntity {
    return new CategoryEntity(category.id, category.name, category.parentId);
  }
}