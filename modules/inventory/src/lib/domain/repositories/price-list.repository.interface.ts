import { PriceListEntity, PriceListItemEntity } from '../entities/price-list.entity';

export const PRICE_LIST_REPOSITORY = 'PRICE_LIST_REPOSITORY';

export interface IPriceListRepository {
  findAll(companyId: string): Promise<PriceListEntity[]>;
  findById(id: string, companyId: string): Promise<PriceListEntity | null>;
  create(entity: Omit<PriceListEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<PriceListEntity>;
  update(id: string, companyId: string, data: Partial<PriceListEntity>): Promise<PriceListEntity>;
  delete(id: string, companyId: string): Promise<void>;
  addItemToPriceList(priceListId: string, productId: string, customPrice: number, defaultPrice: number): Promise<void>;
  removeItemFromPriceList(priceListId: string, productId: string): Promise<void>;
  findItemsByPriceListId(priceListId: string): Promise<PriceListItemEntity[]>;
  upsertItems(priceListId: string, items: { productId: string; customPrice: number; defaultPrice: number }[]): Promise<number>;
}
