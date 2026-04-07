import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrencyService } from './currency.service';

class CreateCurrencyDto {
  code!: string;
  name!: string;
  symbol!: string;
  isBase?: boolean;
}

class AddExchangeRateDto {
  rate!: number;
}

@ApiTags('Currencies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('currencies')
export class CurrencyController {
  constructor(private currencyService: CurrencyService) {}

  @Get()
  findAll() { return this.currencyService.getCurrencies(); }

  @Get('base')
  getBase() { return this.currencyService.getBaseCurrency(); }

  @Post()
  create(@Body() dto: CreateCurrencyDto) {
    return this.currencyService.createCurrency(dto);
  }

  @Post(':id/exchange-rate')
  addRate(@Param('id') id: string, @Body() dto: AddExchangeRateDto) {
    return this.currencyService.addExchangeRate(id, dto.rate);
  }
}