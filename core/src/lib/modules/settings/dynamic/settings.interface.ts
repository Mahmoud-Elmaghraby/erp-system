export type SettingType = 'boolean' | 'select' | 'number' | 'string' | 'date';

export interface SettingOption {
  label: string;
  value: string | number | boolean;
}

export interface SettingDefinition {
  key: string;
  label: string;
  description?: string;
  type: SettingType;
  default: any;
  options?: SettingOption[];
  min?: number;
  max?: number;
  group?: string;
}

export interface ModuleSettingsDefinition {
  module: string;
  label: string;
  icon?: string;
  settings: SettingDefinition[];
}