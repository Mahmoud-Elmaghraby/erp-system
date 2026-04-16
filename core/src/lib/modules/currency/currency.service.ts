import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { CreateCurrencyDto, UpdateCurrencyDto } from './dto/create-currency.dto';

@Injectable()
export class CurrencyService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.currency.findMany({
      where: { isActive: true },
      include: {
        exchangeRates: {
          orderBy: { date: 'desc' },
          take: 1,
        },
      },
      orderBy: { isBase: 'desc' },
    });
  }

  async findBase() {
    return this.prisma.currency.findFirst({
      where: { isBase: true, isActive: true },
    });
  }

  async findOne(id: string) {
    const currency = await this.prisma.currency.findUnique({ where: { id } });
    if (!currency) throw new NotFoundException('Currency not found');
    return currency;
  }

  async create(dto: CreateCurrencyDto) {
    const exists = await this.prisma.currency.findUnique({
      where: { code: dto.code },
    });
    if (exists) throw new ConflictException('Currency code already exists');

    if (dto.isBase) {
      await this.prisma.currency.updateMany({
        where: { isBase: true },
        data: { isBase: false },
      });
    }

    return this.prisma.currency.create({
      data: { id: randomUUID(), ...dto },
    });
  }

  async update(id: string, dto: UpdateCurrencyDto) {
    await this.findOne(id);
    return this.prisma.currency.update({ where: { id }, data: dto });
  }

  async addExchangeRate(currencyId: string, rate: number) {
    await this.findOne(currencyId);
    return this.prisma.exchangeRate.create({
      data: { id: randomUUID(), currencyId, rate, date: new Date() },
    });
  }

  async getExchangeRates(currencyId: string) {
    return this.prisma.exchangeRate.findMany({
      where: { currencyId },
      orderBy: { date: 'desc' },
    });
  }

  async getLatestRate(currencyId: string): Promise<number> {
    const rate = await this.prisma.exchangeRate.findFirst({
      where: { currencyId },
      orderBy: { date: 'desc' },
    });
    return rate ? Number(rate.rate) : 1;
  }
}