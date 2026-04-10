import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequirePermission, PermissionGuard } from '@org/core';
import type { IChartOfAccountRepository } from '../../domain/repositories/chart-of-account.repository.interface';
import { CHART_OF_ACCOUNT_REPOSITORY } from '../../domain/repositories/chart-of-account.repository.interface';
import { ChartOfAccountEntity } from '../../domain/entities/chart-of-account.entity';
import { CreateChartOfAccountDto, UpdateChartOfAccountDto } from '../../application/dtos/chart-of-account.dto';
import { randomUUID } from 'crypto';

@ApiTags('Chart of Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('chart-of-accounts')
export class ChartOfAccountsController {
  constructor(
    @Inject(CHART_OF_ACCOUNT_REPOSITORY)
    private chartOfAccountRepository: IChartOfAccountRepository,
  ) {}

  @Get()
  @RequirePermission('accounting.accounts.view')
  findAll(@Query('companyId') companyId: string) {
    return this.chartOfAccountRepository.findAll(companyId);
  }

  @Get(':id')
  @RequirePermission('accounting.accounts.view')
  findOne(@Param('id') id: string) {
    return this.chartOfAccountRepository.findById(id);
  }

  @Post()
  @RequirePermission('accounting.accounts.create')
  create(@Body() dto: CreateChartOfAccountDto) {
    const account = ChartOfAccountEntity.create({ id: randomUUID(), ...dto });
    return this.chartOfAccountRepository.create(account);
  }

  @Patch(':id')
  @RequirePermission('accounting.accounts.edit')
  update(@Param('id') id: string, @Body() dto: UpdateChartOfAccountDto) {
    return this.chartOfAccountRepository.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('accounting.accounts.delete')
  remove(@Param('id') id: string) {
    return this.chartOfAccountRepository.delete(id);
  }
}