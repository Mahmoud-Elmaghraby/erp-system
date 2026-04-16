
import { IsUUID, IsString, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class StockAdjustmentItemDto {
  @IsUUID()
  productId!: string;

  @IsNumber()
  expectedQuantity!: number;

  @IsNumber()
  actualQuantity!: number;
}

export class CreateStockAdjustmentDto {
  @IsUUID()
  warehouseId!: string;

  @IsString()
  reason!: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockAdjustmentItemDto)
  items!: StockAdjustmentItemDto[];
}

