import { IsString, IsOptional, IsUUID, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSalesReturnItemDto {
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

export class CreateSalesReturnDto {
  @IsUUID()
  orderId!: string;

  @IsString()
  reason!: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSalesReturnItemDto)
  items!: CreateSalesReturnItemDto[];
}