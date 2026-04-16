// modules/accounting/src/lib/presentation/controllers/fiscal-year.controller.ts

import {
  Body, Controller, Get, HttpCode, HttpStatus,
  Param, ParseUUIDPipe, Patch, Post, 
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequirePermission } from '@org/core';
import { FiscalYearService } from '../../application/services/fiscal-year.service';
import { CreateFiscalYearDto, UpdatePeriodStatusDto } from '../../application/dtos/fiscal-year.dto';

@ApiTags('Accounting — Fiscal Years')
@ApiBearerAuth()
@Controller('fiscal-years')
export class FiscalYearController {
  constructor(private readonly fiscalYearService: FiscalYearService) {}

  @ApiOperation({ summary: 'قائمة السنوات المالية' })
  @RequirePermission('accounting.fiscal-years.view')
  @Get()
  findAll(@CurrentUser('companyId') companyId: string) {
    return this.fiscalYearService.findAll(companyId);
  }

  @ApiOperation({ summary: 'تفاصيل سنة مالية' })
  @RequirePermission('accounting.fiscal-years.view')
  @Get(':id')
  findOne(
    @CurrentUser('companyId') companyId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.fiscalYearService.findById(companyId, id);
  }

  @ApiOperation({ summary: 'إنشاء سنة مالية جديدة' })
  @RequirePermission('accounting.fiscal-years.create')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: CreateFiscalYearDto,
  ) {
    return this.fiscalYearService.create(companyId, dto);
  }

  @ApiOperation({ summary: 'إقفال سنة مالية' })
  @RequirePermission('accounting.fiscal-years.close')
  @Post(':id/close')
  @HttpCode(HttpStatus.OK)
  close(
    @CurrentUser('companyId') companyId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.fiscalYearService.close(companyId, id);
  }

  @ApiOperation({ summary: 'قفل سنة مالية نهائياً' })
  @RequirePermission('accounting.fiscal-years.lock')
  @Post(':id/lock')
  @HttpCode(HttpStatus.OK)
  lock(
    @CurrentUser('companyId') companyId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.fiscalYearService.lock(companyId, id);
  }

  @ApiOperation({ summary: 'تغيير حالة فترة محاسبية' })
  @RequirePermission('accounting.fiscal-periods.soft-lock')
  @Patch('periods/:periodId/status')
  @HttpCode(HttpStatus.OK)
  updatePeriodStatus(
    @CurrentUser('companyId') companyId: string,
    @Param('periodId', ParseUUIDPipe) periodId: string,
    @Body() dto: UpdatePeriodStatusDto,
  ) {
    return this.fiscalYearService.updatePeriodStatus(companyId, periodId, dto.status);
  }
}