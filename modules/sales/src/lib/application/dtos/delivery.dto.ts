import { IsString, IsOptional, IsUUID, IsArray, ValidateNested, IsNumber, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDeliveryItemDto {
  @IsUUID()
  productId!: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity!: number;
}

export class CreateDeliveryDto {
  @IsUUID()
  orderId!: string;

  @IsUUID()
  warehouseId!: string;

  @IsUUID()
  branchId!: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  deliveryDate?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDeliveryItemDto)
  items!: CreateDeliveryItemDto[];
}