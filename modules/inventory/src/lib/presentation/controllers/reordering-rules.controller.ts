import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard, CurrentUser } from '@org/core';
import type { IReorderingRuleRepository } from '../../domain/repositories/reordering-rule.repository.interface';
import { REORDERING_RULE_REPOSITORY } from '../../domain/repositories/reordering-rule.repository.interface';
import { ReorderingRuleEntity } from '../../domain/entities/reordering-rule.entity';
import { UpsertReorderingRuleDto } from '../../application/dtos/reordering-rule.dto';
import { randomUUID } from 'crypto';

@ApiTags('Reordering Rules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('reordering-rules')
export class ReorderingRulesController {
  constructor(
    @Inject(REORDERING_RULE_REPOSITORY)
    private reorderingRuleRepository: IReorderingRuleRepository,
  ) {}

  @Get()
  @RequirePermission('inventory.reordering.view')
  findAll(
    @CurrentUser('companyId') companyId: string,
    @Query('warehouseId') warehouseId?: string,
  ) {
    return this.reorderingRuleRepository.findAll(companyId, warehouseId);
  }

  @Post()
  @RequirePermission('inventory.reordering.create')
  upsert(@Body() dto: UpsertReorderingRuleDto) {
    const rule = ReorderingRuleEntity.create({ id: randomUUID(), ...dto });
    return this.reorderingRuleRepository.upsert(rule);
  }

  @Delete(':id')
  @RequirePermission('inventory.reordering.delete')
  delete(@Param('id') id: string) {
    return this.reorderingRuleRepository.delete(id);
  }
}