import { IsString, IsOptional, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PriceListItemDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  productId!: string;

  @IsNumber()
  defaultPrice!: number;

  @IsNumber()
  customPrice!: number;
}

export class CreatePriceListDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PriceListItemDto)
  items?: PriceListItemDto[];
}

export class UpdatePriceListDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PriceListItemDto)
  items?: PriceListItemDto[];
}

export class AddPriceListItemDto {
  @IsString()
  productId!: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  customPrice!: number;
}
