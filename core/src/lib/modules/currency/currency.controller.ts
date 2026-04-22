import {
  Controller, Get, Post, Patch,
  Body, Param, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionGuard } from '../rbac/permission.guard';
import { RequirePermission } from '../rbac/require-permission.decorator';
import { CurrencyService } from './currency.service';
import {
  CreateCurrencyDto,
  UpdateCurrencyDto,
  AddExchangeRateDto,
} from './dto/create-currency.dto';

@ApiTags('Currencies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('currencies')
export class CurrencyController {
  constructor(private currencyService: CurrencyService) {}

  @Get()
  @RequirePermission('core.currencies.view')
  @ApiOperation({ summary: 'Get all active currencies' })
  findAll() {
    return this.currencyService.findAll();
  }

  @Get('base')
  @RequirePermission('core.currencies.view')
  @ApiOperation({ summary: 'Get base currency' })
  findBase() {
    return this.currencyService.findBase();
  }

  @Get(':id')
  @RequirePermission('core.currencies.view')
  @ApiOperation({ summary: 'Get currency by id' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.currencyService.findOne(id);
  }

  @Post()
  @RequirePermission('core.currencies.create')
  @ApiOperation({ summary: 'Create new currency' })
  create(@Body() dto: CreateCurrencyDto) {
    return this.currencyService.create(dto);
  }

  @Patch(':id')
  @RequirePermission('core.currencies.edit')
  @ApiOperation({ summary: 'Update currency' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCurrencyDto,
  ) {
    return this.currencyService.update(id, dto);
  }

  @Post(':id/exchange-rates')
  @RequirePermission('core.currencies.edit')
  @ApiOperation({ summary: 'Add exchange rate' })
  addRate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddExchangeRateDto,
  ) {
    return this.currencyService.addExchangeRate(id, dto.rate);
  }

  @Get(':id/exchange-rates')
  @RequirePermission('core.currencies.view')
  @ApiOperation({ summary: 'Get exchange rate history' })
  getRates(@Param('id', ParseUUIDPipe) id: string) {
    return this.currencyService.getExchangeRates(id);
  }
}