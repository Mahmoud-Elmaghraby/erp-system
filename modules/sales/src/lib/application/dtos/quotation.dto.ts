import { IsString, IsOptional, IsUUID, IsArray, ValidateNested, IsNumber, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuotationItemDto {
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

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  discount?: number;

  @IsOptional()
  @IsUUID()
  taxId?: string;
}

export class CreateQuotationDto {
  @IsUUID()
  branchId!: string;

  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsString()
  notes?: string;

@IsOptional()
@IsDateString()
validUntil?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsUUID()
  paymentTermId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  discountAmount?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuotationItemDto)
  items!: CreateQuotationItemDto[];
}

export class UpdateQuotationDto {
  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  validUntil?: Date;

  @IsOptional()
  @IsUUID()
  paymentTermId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  discountAmount?: number;
}