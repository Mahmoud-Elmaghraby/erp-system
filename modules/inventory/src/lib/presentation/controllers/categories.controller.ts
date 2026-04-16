
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  JwtAuthGuard,
  RequirePermission,
  PermissionGuard,
  CurrentUser,
} from '@org/core';

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
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  @Get()
  @RequirePermission('inventory.categories.view')
  async findAll(@CurrentUser('companyId') companyId: string) {
    return this.categoryRepository.findAll(companyId);
  }

  @Post()
  @RequirePermission('inventory.categories.create')
  async create(
    @Body() dto: CreateCategoryDto,
    @CurrentUser('companyId') companyId: string,
  ) {
    return this.createCategoryUseCase.execute(dto, companyId);
  }

  @Delete(':id')
  @RequirePermission('inventory.categories.delete')
  async remove(
    @Param('id') id: string,
    @CurrentUser('companyId') companyId: string,
  ) {
    return this.categoryRepository.delete(id, companyId);
  }
}

