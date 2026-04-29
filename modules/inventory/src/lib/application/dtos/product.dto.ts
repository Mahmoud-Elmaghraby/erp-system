import { IsString, IsOptional, IsNumber, IsNotEmpty, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsNotEmpty({ message: 'سعر البيع مطلوب' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price!: number;

  @IsNotEmpty({ message: 'تكلفة المنتج مطلوبة' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  cost!: number;

  @IsNotEmpty({ message: 'أقل سعر للبيع مطلوب' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  lowestPrice!: number;

  @IsUUID()
  categoryId!: string;

  @IsOptional()
  @IsUUID()
  unitOfMeasureId?: string;

  @IsOptional()
  @IsString()
  itemCode?: string;

  @IsOptional()
  @IsString()
  itemType?: string;

  @IsOptional()
  @IsString()
  unitType?: string;

  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  taxAmount?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discountPercentage?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discountAmount?: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsNotEmpty({ message: 'سعر البيع مطلوب' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price!: number;

  @IsNotEmpty({ message: 'تكلفة المنتج مطلوبة' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  cost!: number;

  @IsNotEmpty({ message: 'أقل سعر للبيع مطلوب' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  lowestPrice!: number;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  unitOfMeasureId?: string;

  @IsOptional()
  @IsString()
  itemCode?: string;

  @IsOptional()
  @IsString()
  itemType?: string;

  @IsOptional()
  @IsString()
  unitType?: string;

  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  taxAmount?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discountPercentage?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discountAmount?: number;
}