import type { ReorderingRuleEntity } from '../entities/reordering-rule.entity';

export interface IReorderingRuleRepository {
  findAll(companyId: string, warehouseId?: string): Promise<ReorderingRuleEntity[]>;
  findByProductAndWarehouse(productId: string, warehouseId: string): Promise<ReorderingRuleEntity | null>;
  upsert(rule: ReorderingRuleEntity): Promise<ReorderingRuleEntity>;
  delete(id: string): Promise<void>;
}

export const REORDERING_RULE_REPOSITORY = 'REORDERING_RULE_REPOSITORY';