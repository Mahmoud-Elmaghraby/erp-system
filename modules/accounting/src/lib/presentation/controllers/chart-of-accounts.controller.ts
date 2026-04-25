import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';

import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import {
  JwtAuthGuard,
  RequirePermission,
  PermissionGuard,
  CurrentUser,
} from '@org/core';

// DTOs
import { CreateAccountDto } from '../../application/dtos/create-account.dto';
import { UpdateAccountDto } from '../../application/dtos/update-account.dto';

// UseCases
import { CreateChartOfAccountUseCase } from '../../application/use-cases/chart-of-accounts/create-chart-of-account.use-case';
import { UpdateChartOfAccountUseCase } from '../../application/use-cases/chart-of-accounts/update-chart-of-account.use-case';
import { GetAccountsTreeUseCase } from '../../application/use-cases/chart-of-accounts/get-accounts-tree.use-case';
import { MoveAccountUseCase } from '../../application/use-cases/chart-of-accounts/move-account.use-case';
import { DeleteAccountUseCase } from '../../application/use-cases/chart-of-accounts/delete-account.use-case';

// Repository
import { CHART_OF_ACCOUNT_REPOSITORY } from '../../domain/repositories/chart-of-account.repository.interface';
import type { IChartOfAccountRepository } from '../../domain/repositories/chart-of-account.repository.interface';
import { Inject } from '@nestjs/common';

@ApiTags('Accounting — Chart of Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('chart-of-accounts')
export class ChartOfAccountsController {

  constructor(
    private readonly createUseCase: CreateChartOfAccountUseCase,
    private readonly updateUseCase: UpdateChartOfAccountUseCase,
    private readonly treeUseCase: GetAccountsTreeUseCase,
    private readonly moveUseCase: MoveAccountUseCase,
    private readonly deleteUseCase: DeleteAccountUseCase,

    @Inject(CHART_OF_ACCOUNT_REPOSITORY)
    private readonly repository: IChartOfAccountRepository,
  ) {}

  @ApiOperation({ summary: 'List accounts' })
  @RequirePermission('accounting.accounts.view')
  @Get()
  findAll(@CurrentUser('companyId') companyId: string) {
    return this.repository.findAll(companyId);
  }

  @ApiOperation({ summary: 'Get account by id' })
  @RequirePermission('accounting.accounts.view')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repository.findById(id);
  }

  @ApiOperation({ summary: 'Get accounts tree' })
  @RequirePermission('accounting.accounts.view')
  @Get('tree/all')
  getTree(@CurrentUser('companyId') companyId: string) {
    return this.treeUseCase.execute(companyId);
  }

  @ApiOperation({ summary: 'Create account' })
  @RequirePermission('accounting.accounts.create')
  @Post()
  create(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: CreateAccountDto,
  ) {
    return this.createUseCase.execute(dto, companyId);
  }

  @ApiOperation({ summary: 'Update account' })
  @RequirePermission('accounting.accounts.edit')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser('companyId') companyId: string,
    @Body() dto: UpdateAccountDto,
  ) {
    return this.updateUseCase.execute(id, dto, companyId);
  }

  @ApiOperation({ summary: 'Move account in tree' })
  @RequirePermission('accounting.accounts.edit')
  @Patch(':id/move')
  move(
    @Param('id') id: string,
    @Body('parentId') parentId: string | null,
    @CurrentUser('companyId') companyId: string,
  ) {
    return this.moveUseCase.execute(id, parentId, companyId);
  }

  @ApiOperation({ summary: 'Delete account' })
  @RequirePermission('accounting.accounts.delete')
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser('companyId') companyId: string,
  ) {
    return this.deleteUseCase.execute(id, companyId);
  }
}