import { Controller, Get, Post, Delete, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard } from '@org/core';
import { CreateCategoryUseCase } from '../../application/use-cases/categories/create-category.use-case';
import type { ICategoryRepository } from '../../domain/repositories/category.repository.interface';
import { CATEGORY_REPOSITORY } from '../../domain/repositories/category.repository.interface';
import { CreateCategoryDto } from '../../application/dtos/category.dto';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('categories')
export class CategoriesController {
  constructor(
    private createCategoryUseCase: CreateCategoryUseCase,
    @Inject(CATEGORY_REPOSITORY)
    private categoryRepository: ICategoryRepository,
  ) {}

  @Get()
  @RequirePermission('inventory.categories.view')
  findAll() {
    return this.categoryRepository.findAll();
  }

  @Post()
  @RequirePermission('inventory.categories.create')
  create(@Body() dto: CreateCategoryDto) {
    return this.createCategoryUseCase.execute(dto);
  }

  @Delete(':id')
  @RequirePermission('inventory.categories.delete')
  remove(@Param('id') id: string) {
    return this.categoryRepository.delete(id);
  }
}