import type { LotNumberEntity } from '../entities/lot-number.entity';

export interface ILotNumberRepository {
  findByProduct(productId: string, warehouseId?: string): Promise<LotNumberEntity[]>;
  findByLotNumber(lotNumber: string): Promise<LotNumberEntity | null>;
  create(lot: LotNumberEntity): Promise<LotNumberEntity>;
  updateQuantity(id: string, quantity: number): Promise<LotNumberEntity>;
}

export const LOT_NUMBER_REPOSITORY = 'LOT_NUMBER_REPOSITORY';