import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export const SALES_SETTINGS_STATUS_VALUES = [
  'ACTIVE',
  'INACTIVE',
  'active',
  'inactive',
] as const;

export const PRICE_LIST_SOURCE_TYPES = ['BASE_PRICE', 'OTHER_LIST'] as const;
export const PRICE_LIST_ADJUSTMENT_TYPES = ['VALUE', 'PERCENTAGE'] as const;

export class CreatePriceListDto {
  @ApiProperty({ description: 'Price list display name' })
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiPropertyOptional({ enum: SALES_SETTINGS_STATUS_VALUES, default: 'active' })
  @IsOptional()
  @IsIn(SALES_SETTINGS_STATUS_VALUES)
  status?: (typeof SALES_SETTINGS_STATUS_VALUES)[number];
}

export class UpdatePriceListDto extends PartialType(CreatePriceListDto) {}

export class BulkUpdatePriceListsDto {
  @ApiProperty({ enum: PRICE_LIST_SOURCE_TYPES })
  @IsIn(PRICE_LIST_SOURCE_TYPES)
  sourceType!: (typeof PRICE_LIST_SOURCE_TYPES)[number];

  @ApiPropertyOptional({ description: 'Required when sourceType is OTHER_LIST' })
  @IsOptional()
  @IsString()
  sourceListId?: string;

  @ApiProperty({ enum: PRICE_LIST_ADJUSTMENT_TYPES })
  @IsIn(PRICE_LIST_ADJUSTMENT_TYPES)
  adjustmentType!: (typeof PRICE_LIST_ADJUSTMENT_TYPES)[number];

  @ApiProperty({ description: 'Signed value for value/percentage adjustment' })
  @IsNumber()
  adjustmentValue!: number;
}

export class OrderSourceInputDto {
  @ApiPropertyOptional({ description: 'Optional source id (if omitted, backend generates one)' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiPropertyOptional({ enum: SALES_SETTINGS_STATUS_VALUES, default: 'active' })
  @IsOptional()
  @IsIn(SALES_SETTINGS_STATUS_VALUES)
  status?: (typeof SALES_SETTINGS_STATUS_VALUES)[number];
}

export class SaveOrderSourcesDto {
  @ApiProperty({ type: [OrderSourceInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderSourceInputDto)
  sources!: OrderSourceInputDto[];

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  defaultSourceId?: string | null;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isMandatory?: boolean;
}

export class UpdateShippingConfigDto {
  @ApiPropertyOptional({ description: 'Enable shipping options flow' })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @ApiPropertyOptional({ nullable: true, description: 'Service item id for COD fee line' })
  @IsOptional()
  @IsString()
  codFeeItemId?: string | null;
}

export class CreateShippingOptionDto {
  @ApiProperty()
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiPropertyOptional({ enum: SALES_SETTINGS_STATUS_VALUES, default: 'active' })
  @IsOptional()
  @IsIn(SALES_SETTINGS_STATUS_VALUES)
  status?: (typeof SALES_SETTINGS_STATUS_VALUES)[number];
}

export class UpdateShippingOptionDto extends PartialType(CreateShippingOptionDto) {}

export class CreatePriceOfferDto {
  @ApiProperty()
  @IsString()
  @MaxLength(160)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  validTo?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  requiredQty?: number;

  @ApiPropertyOptional({ default: 'item-discount' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty()
  @IsNumber()
  discountValue!: number;

  @ApiPropertyOptional({ default: 'fixed' })
  @IsOptional()
  @IsString()
  discountType?: string;

  @ApiPropertyOptional({ default: 'all' })
  @IsOptional()
  @IsString()
  customerScope?: string;

  @ApiPropertyOptional({ default: 'all' })
  @IsOptional()
  @IsString()
  unitType?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdatePriceOfferDto extends PartialType(CreatePriceOfferDto) {}
