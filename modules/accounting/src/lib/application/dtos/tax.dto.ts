import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID } from 'class-validator';

export class CreateTaxDto {
  @ApiProperty() @IsString() @IsNotEmpty() name!: string;
  @ApiProperty() @IsNumber() rate!: number;

  @ApiPropertyOptional({ enum: ['PERCENTAGE', 'FIXED', 'NONE'] })
  @IsString() @IsOptional() taxType?: 'PERCENTAGE' | 'FIXED' | 'NONE';

  @ApiPropertyOptional({ enum: ['SALES', 'PURCHASES', 'BOTH'] })
  @IsString() @IsOptional() scope?: 'SALES' | 'PURCHASES' | 'BOTH';

  @ApiPropertyOptional() @IsUUID() @IsOptional() salesAccountId?:    string;
  @ApiPropertyOptional() @IsUUID() @IsOptional() purchaseAccountId?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() etaType?:    string;
  @ApiPropertyOptional() @IsString() @IsOptional() etaSubtype?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() zatcaType?:  string;
}

export class UpdateTaxDto {
  @ApiPropertyOptional() @IsString() @IsOptional()  name?: string;
  @ApiPropertyOptional() @IsNumber() @IsOptional()  rate?: number;
  @ApiPropertyOptional() @IsString() @IsOptional()  taxType?: 'PERCENTAGE' | 'FIXED' | 'NONE';
  @ApiPropertyOptional() @IsString() @IsOptional()  scope?: 'SALES' | 'PURCHASES' | 'BOTH';
  @ApiPropertyOptional() @IsUUID() @IsOptional()    salesAccountId?:    string;
  @ApiPropertyOptional() @IsUUID() @IsOptional()    purchaseAccountId?: string;
  @ApiPropertyOptional() @IsString() @IsOptional()  etaType?:    string;
  @ApiPropertyOptional() @IsString() @IsOptional()  etaSubtype?: string;
  @ApiPropertyOptional() @IsString() @IsOptional()  zatcaType?:  string;
}