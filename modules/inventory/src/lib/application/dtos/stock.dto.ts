
import { IsUUID, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddStockDto {
  @IsUUID()
  warehouseId!: string;

  @IsUUID()
  productId!: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity!: number;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class RemoveStockDto {
  @IsUUID()
  warehouseId!: string;

  @IsUUID()
  productId!: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity!: number;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class TransferStockDto {
  @IsUUID()
  fromWarehouseId!: string;

  @IsUUID()
  toWarehouseId!: string;

  @IsUUID()
  productId!: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity!: number;
}

