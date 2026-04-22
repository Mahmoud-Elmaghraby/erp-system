import { IsString, IsOptional } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  name!: string;

  @IsString()
  symbol!: string;

  @IsOptional()
  @IsString()
  unitCode?: string;
}

export class UpdateUnitDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  symbol?: string;

  @IsOptional()
  @IsString()
  unitCode?: string;
} 