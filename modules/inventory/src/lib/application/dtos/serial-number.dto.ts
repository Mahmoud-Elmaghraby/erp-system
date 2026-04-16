import { IsUUID, IsArray, IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateSerialNumbersDto {
  @IsUUID()
  productId!: string;

  @IsUUID()
  warehouseId!: string;

  @IsArray()
  @IsString({ each: true })
  serialNumbers!: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateSerialNumberStatusDto {
  @IsEnum(['IN_STOCK', 'SOLD', 'RETURNED', 'DEFECTIVE'])
  status!: 'IN_STOCK' | 'SOLD' | 'RETURNED' | 'DEFECTIVE';
}