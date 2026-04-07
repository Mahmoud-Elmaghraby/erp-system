import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class CurrencyService {
  constructor(private prisma: PrismaService) {}

  async getCurrencies(): Promise<any[]> {
    return this.prisma.currency.findMany({ where: { isActive: true } });
  }

  async getBaseCurrency(): Promise<any> {
    return this.prisma.currency.findFirst({ where: { isBase: true } });
  }

  async addExchangeRate(currencyId: string, rate: number): Promise<any> {
    return this.prisma.exchangeRate.create({
      data: { id: randomUUID(), currencyId, rate, date: new Date() },
    });
  }

  async getLatestRate(currencyCode: string): Promise<number> {
    const currency = await this.prisma.currency.findUnique({
      where: { code: currencyCode },
      include: {
        exchangeRates: {
          orderBy: { date: 'desc' },
          take: 1,
        },
      },
    });

    if (!currency) throw new NotFoundException(`Currency ${currencyCode} not found`);
    if (currency.isBase) return 1;
    if (!currency.exchangeRates.length) throw new NotFoundException(`No exchange rate for ${currencyCode}`);

    return Number(currency.exchangeRates[0].rate);
  }

  async convert(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) return amount;

    const fromRate = await this.getLatestRate(fromCurrency);
    const toRate = await this.getLatestRate(toCurrency);

    const inBase = amount / fromRate;
    return inBase * toRate;
  }

  async createCurrency(data: { code: string; name: string; symbol: string; isBase?: boolean }): Promise<any> {
    if (data.isBase) {
      await this.prisma.currency.updateMany({ data: { isBase: false } });
    }
    return this.prisma.currency.create({
      data: { id: randomUUID(), ...data },
    });
  }
}