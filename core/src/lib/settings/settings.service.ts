import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SettingsRegistry } from './settings.registry';
import { randomUUID } from 'crypto';

@Injectable()
export class SettingsService {
  constructor(
    private prisma: PrismaService,
    private registry: SettingsRegistry,
  ) {}

  async getAvailableModules(companyId: string): Promise<any[]> {
    const modules = this.registry.getAll();
    const result = [];

    for (const module of modules) {
      const values = await this.getModuleSettings(companyId, module.module);
      result.push({
        ...module,
        settings: module.settings.map(setting => ({
          ...setting,
          value: values[setting.key] ?? setting.default,
        })),
      });
    }

    return result;
  }

  async getModuleSettings(companyId: string, module: string): Promise<Record<string, any>> {
    const settings = await this.prisma.moduleSetting.findMany({
      where: { companyId, module },
    });

    const result: Record<string, any> = {};
    for (const setting of settings) {
      result[setting.key] = setting.value;
    }

    return result;
  }

  async updateModuleSettings(
    companyId: string,
    module: string,
    values: Record<string, any>,
  ): Promise<void> {
    for (const [key, value] of Object.entries(values)) {
      await this.prisma.moduleSetting.upsert({
        where: { companyId_module_key: { companyId, module, key } },
        update: { value: String(value) },
        create: {
          id: randomUUID(),
          companyId,
          module,
          key,
          value: String(value),
        },
      });
    }
  }

  async getSetting(companyId: string, module: string, key: string): Promise<any> {
    const setting = await this.prisma.moduleSetting.findUnique({
      where: { companyId_module_key: { companyId, module, key } },
    });

    if (!setting) {
      const moduleDefinition = this.registry.getModule(module);
      const settingDef = moduleDefinition?.settings.find(s => s.key === key);
      return settingDef?.default ?? null;
    }

    return setting.value;
  }
}