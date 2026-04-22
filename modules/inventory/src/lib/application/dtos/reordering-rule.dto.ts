
import { IsUUID, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpsertReorderingRuleDto {
  @IsUUID()
  productId!: string;

  @IsUUID()
  warehouseId!: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minQuantity!: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxQuantity!: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  reorderQuantity!: number;
}

