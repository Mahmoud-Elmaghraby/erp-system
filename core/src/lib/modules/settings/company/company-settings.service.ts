import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { UpdateCompanySettingsDto } from './dto/update-company-settings.dto';

export interface ICompanySettings {
  id: string;
  companyId: string;
  // General
  defaultCurrency: string;
  fiscalYearStart: number;
  taxIncludedInPrice: boolean;
  // Prefixes
  salesOrderPrefix: string;
  purchaseOrderPrefix: string;
  invoicePrefix: string;
  receiptPrefix: string;
  billPrefix: string;
  quotationPrefix: string;
  rfqPrefix: string;
  deliveryPrefix: string;
  returnPrefix: string;
  shipmentPrefix: string;
  // E-Invoice
  country: string;
  taxRegNumber: string | null;
  commercialReg: string | null;
  activityCode: string | null;
  // ETA
  etaEnabled: boolean;
  etaClientId: string | null;
  etaClientSecret: string | null;
  etaEnvironment: string;
  // ZATCA
  zatcaEnabled: boolean;
  zatcaCSID: string | null;
  zatcaEnvironment: string;
}

@Injectable()
export class CompanySettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings(companyId: string): Promise<ICompanySettings> {
    let settings = await this.prisma.companySettings.findUnique({
      where: { companyId },
    });

    if (!settings) {
      settings = await this.prisma.companySettings.create({
        data: { id: randomUUID(), companyId },
      });
    }

    return settings as ICompanySettings;
  }

  async updateSettings(
    companyId: string,
    dto: UpdateCompanySettingsDto,
  ): Promise<ICompanySettings> {
    return this.prisma.companySettings.upsert({
      where: { companyId },
      update: dto,
      create: { id: randomUUID(), companyId, ...dto },
    }) as Promise<ICompanySettings>;
  }
}