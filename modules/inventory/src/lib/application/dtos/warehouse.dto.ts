
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateWarehouseDto {
  @IsString()
  name!: string;

  @IsUUID()
  branchId!: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class UpdateWarehouseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
