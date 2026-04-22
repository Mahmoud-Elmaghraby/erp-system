import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import {
  IsBoolean, IsEnum, IsOptional, IsString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  JwtAuthGuard,
  PermissionGuard,
  CurrentUser,
  RequirePermission,
  AccountingSettingsService,
} from '@org/core';

export class UpdateAccountingSettingsDto {
  @ApiPropertyOptional()
  @IsBoolean() @IsOptional()
  journalEntriesEnabled?: boolean;

  @ApiPropertyOptional({ enum: ['ACCRUAL', 'CASH'] })
  @IsEnum(['ACCRUAL', 'CASH']) @IsOptional()
  method?: string;

  @ApiPropertyOptional({ enum: ['EXCLUSIVE', 'INCLUSIVE'] })
  @IsEnum(['EXCLUSIVE', 'INCLUSIVE']) @IsOptional()
  taxMethod?: string;

  @ApiPropertyOptional()
  @IsBoolean() @IsOptional()
  multiCurrency?: boolean;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  defaultSalesAccount?: string;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  defaultCOGSAccount?: string;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  defaultExpenseAccount?: string;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  defaultARAccount?: string;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  defaultAPAccount?: string;
}

@ApiTags('Accounting Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('settings')
export class AccountingSettingsController {
  constructor(private accountingSettingsService: AccountingSettingsService) {}

  @Get()
  @RequirePermission('accounting.settings.view')
  @ApiOperation({ summary: 'Get accounting settings' })
  getSettings(@CurrentUser('companyId') companyId: string) {
    return this.accountingSettingsService.getSettings(companyId);
  }

  @Patch()
  @RequirePermission('accounting.settings.edit')
  @ApiOperation({ summary: 'Update accounting settings' })
  updateSettings(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: UpdateAccountingSettingsDto,
  ) {
    return this.accountingSettingsService.updateSettings(companyId, dto);
  }
}