import { IsString, IsUUID, IsNumber, Min, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLotNumberDto {
  @IsString()
  lotNumber!: string;

  @IsUUID()
  productId!: string;

  @IsUUID()
  warehouseId!: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  quantity!: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}