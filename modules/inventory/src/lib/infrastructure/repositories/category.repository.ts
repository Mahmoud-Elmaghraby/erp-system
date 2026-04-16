
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/core';
import type { ICategoryRepository } from '../../domain/repositories/category.repository.interface';
import { CategoryEntity } from '../../domain/entities/category.entity';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string): Promise<CategoryEntity[]> {
    const categories = await this.prisma.category.findMany({
      where: { companyId },
      orderBy: { name: 'asc' },
    });

    return categories.map((c) => this.toEntity(c));
  }

  async findById(id: string, companyId: string): Promise<CategoryEntity | null> {
    const category = await this.prisma.category.findFirst({
      where: {
        id,
        companyId,
      },
    });

    return category ? this.toEntity(category) : null;
  }

  async create(entity: CategoryEntity): Promise<CategoryEntity> {
    const category = await this.prisma.category.create({
      data: {
        id: entity.id,
        name: entity.name,
        parentId: entity.parentId,
        companyId: entity.companyId,
      },
    });

    return this.toEntity(category);
  }

  async delete(id: string, companyId: string): Promise<void> {
    await this.prisma.category.deleteMany({
      where: {
        id,
        companyId,
      },
    });
  }

  private toEntity(category: {
    id: string;
    name: string;
    parentId: string | null;
    companyId: string;
  }): CategoryEntity {
    return new CategoryEntity(
      category.id,
      category.name,
      category.parentId,
      category.companyId,
    );
  }
}

