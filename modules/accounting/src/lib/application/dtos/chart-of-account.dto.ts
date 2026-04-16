import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class CreateChartOfAccountDto {
  @ApiProperty() @IsString() @IsNotEmpty() code!: string;
  @ApiProperty() @IsString() @IsNotEmpty() name!: string;

  @ApiProperty({ enum: ['ASSET','LIABILITY','EQUITY','REVENUE','EXPENSE','COGS','BANK','CASH','RECEIVABLE','PAYABLE'] })
  @IsString() @IsNotEmpty()
  type!: string;

  @ApiProperty({ enum: ['DEBIT', 'CREDIT'] })
  @IsString() @IsNotEmpty()
  normalBalance!: 'DEBIT' | 'CREDIT';

  @ApiPropertyOptional() @IsInt() @IsOptional()     level?: number;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isGroup?: boolean;
  @ApiPropertyOptional() @IsString() @IsOptional()  parentId?: string;
}

export class UpdateChartOfAccountDto {
  @ApiPropertyOptional() @IsString() @IsOptional()  name?: string;
  @ApiPropertyOptional() @IsString() @IsOptional()  type?: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isActive?: boolean;
}