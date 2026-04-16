// أنشئ: core/src/lib/settings/logistics/logistics-settings.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { randomUUID } from 'crypto';

export interface ILogisticsSettings {
  localDeliveryEnabled: boolean;
  exportEnabled: boolean;
  storageEnabled: boolean;
  vehicleManagement: boolean;
}

@Injectable()
export class LogisticsSettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings(companyId: string): Promise<ILogisticsSettings> {
    let settings = await this.prisma.logisticsSettings.findUnique({
      where: { companyId },
    });
    if (!settings) {
      settings = await this.prisma.logisticsSettings.create({
        data: { id: randomUUID(), companyId },
      });
    }
    return settings as ILogisticsSettings;
  }

  async updateSettings(
    companyId: string,
    data: Partial<ILogisticsSettings>,
  ): Promise<ILogisticsSettings> {
    return this.prisma.logisticsSettings.upsert({
      where: { companyId },
      update: data,
      create: { id: randomUUID(), companyId, ...data },
    }) as Promise<ILogisticsSettings>;
  }
}