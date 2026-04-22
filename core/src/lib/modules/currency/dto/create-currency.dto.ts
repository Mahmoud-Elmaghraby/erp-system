import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateCurrencyDto {
  @ApiProperty({ example: 'USD' })
  @IsString() @IsNotEmpty()
  code!: string;

  @ApiProperty({ example: 'US Dollar' })
  @IsString() @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: '$' })
  @IsString() @IsNotEmpty()
  symbol!: string;

  @ApiPropertyOptional()
  @IsBoolean() @IsOptional()
  isBase?: boolean;
}

export class UpdateCurrencyDto {
  @ApiPropertyOptional() @IsString() @IsOptional()
  name?: string;

  @ApiPropertyOptional() @IsString() @IsOptional()
  symbol?: string;

  @ApiPropertyOptional() @IsBoolean() @IsOptional()
  isActive?: boolean;
}

export class AddExchangeRateDto {
  @ApiProperty({ example: 30.5 })
  @IsNumber() @IsPositive()
  rate!: number;
}