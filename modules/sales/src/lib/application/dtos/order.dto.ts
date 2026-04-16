import { IsString, IsOptional, IsUUID, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsUUID()
  productId!: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity!: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  unitPrice!: number;
}

export class CreateOrderDto {
  @IsUUID()
  branchId!: string;

  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  paymentTermId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}