import type { SerialNumberEntity } from '../entities/serial-number.entity';

export interface ISerialNumberRepository {
  findByProduct(productId: string, warehouseId?: string): Promise<SerialNumberEntity[]>;
  findBySerialNumber(serialNumber: string): Promise<SerialNumberEntity | null>;
  findByStatus(status: string, warehouseId?: string): Promise<SerialNumberEntity[]>;
  createMany(serials: SerialNumberEntity[]): Promise<SerialNumberEntity[]>;
  updateStatus(id: string, status: string): Promise<SerialNumberEntity>;
}

export const SERIAL_NUMBER_REPOSITORY = 'SERIAL_NUMBER_REPOSITORY';