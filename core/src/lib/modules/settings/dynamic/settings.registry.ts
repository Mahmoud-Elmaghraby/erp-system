import { Injectable } from '@nestjs/common';
import type { ModuleSettingsDefinition } from './settings.interface';

@Injectable()
export class SettingsRegistry {
  private modules: Map<string, ModuleSettingsDefinition> = new Map();

  register(definition: ModuleSettingsDefinition): void {
    this.modules.set(definition.module, definition);
  }

  getAll(): ModuleSettingsDefinition[] {
    return Array.from(this.modules.values());
  }

  getModule(module: string): ModuleSettingsDefinition | undefined {
    return this.modules.get(module);
  }

  getModuleKeys(): string[] {
    return Array.from(this.modules.keys());
  }
}