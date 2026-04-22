import { UnitEntity } from '../entities/unit.entity';

export interface IUnitRepository {
  findAll(companyId: string): Promise<UnitEntity[]>;
  findById(id: string): Promise<UnitEntity | null>;
  create(unit: UnitEntity): Promise<UnitEntity>;
  update(id: string, data: Partial<UnitEntity>): Promise<UnitEntity>;
  delete(id: string): Promise<void>;
}

export const UNIT_REPOSITORY = 'UNIT_REPOSITORY';