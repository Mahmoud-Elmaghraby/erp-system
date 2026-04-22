import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards, Inject,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard, CurrentUser } from '@org/core';
import type { IChartOfAccountRepository } from '../../domain/repositories/chart-of-account.repository.interface';
import { CHART_OF_ACCOUNT_REPOSITORY } from '../../domain/repositories/chart-of-account.repository.interface';
import { ChartOfAccountEntity, AccountType, NormalBalance } from '../../domain/entities/chart-of-account.entity';
import { CreateChartOfAccountDto, UpdateChartOfAccountDto } from '../../application/dtos/chart-of-account.dto';
import { randomUUID } from 'crypto';

@ApiTags('Accounting — Chart of Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('chart-of-accounts')
export class ChartOfAccountsController {
  constructor(
    @Inject(CHART_OF_ACCOUNT_REPOSITORY)
    private chartOfAccountRepository: IChartOfAccountRepository,
  ) {}

  @ApiOperation({ summary: 'قائمة الحسابات' })
  @RequirePermission('accounting.accounts.view')
  @Get()
  findAll(@CurrentUser('companyId') companyId: string) {
    return this.chartOfAccountRepository.findAll(companyId);
  }

  @ApiOperation({ summary: 'تفاصيل حساب' })
  @RequirePermission('accounting.accounts.view')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chartOfAccountRepository.findById(id);
  }

  @ApiOperation({ summary: 'إضافة حساب' })
  @RequirePermission('accounting.accounts.create')
  @Post()
  create(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: CreateChartOfAccountDto,
  ) {
    // ✅ companyId من JWT + type casting صح
    const account = ChartOfAccountEntity.create({
      id:            randomUUID(),
      code:          dto.code,
      name:          dto.name,
      type:          dto.type as AccountType,
      normalBalance: dto.normalBalance as NormalBalance,
      level:         dto.level,
      isGroup:       dto.isGroup,
      parentId:      dto.parentId,
      companyId,     // ✅ من JWT مش من الـ body
    });
    return this.chartOfAccountRepository.create(account);
  }

  @ApiOperation({ summary: 'تعديل حساب' })
  @RequirePermission('accounting.accounts.edit')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateChartOfAccountDto,
  ) {
    return this.chartOfAccountRepository.update(id, {
      name:    dto.name,
      type:    dto.type as AccountType | undefined,
      isActive: dto.isActive,
    });
  }

  @ApiOperation({ summary: 'حذف حساب' })
  @RequirePermission('accounting.accounts.delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chartOfAccountRepository.delete(id);
  }
}