import type { InventorySettingsEntity } from '../entities/inventory-settings.entity';

export interface IInventorySettingsRepository {
  findByCompany(companyId: string): Promise<InventorySettingsEntity | null>;
  upsert(settings: InventorySettingsEntity): Promise<InventorySettingsEntity>;
}

export const INVENTORY_SETTINGS_REPOSITORY = 'INVENTORY_SETTINGS_REPOSITORY';