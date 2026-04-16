
import { IsString, IsOptional, IsNumber, IsUUID, Min, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductVariantDto {
  @IsUUID()
  productId!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  cost?: number;

  @IsOptional()
  @IsObject()
  attributes?: Record<string, string>;
}

export class UpdateProductVariantDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  cost?: number;

  @IsOptional()
  @IsObject()
  attributes?: Record<string, string>;
}

