
import { IsOptional, IsEnum, IsBoolean, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateInventorySettingsDto {
  @IsOptional()
  @IsEnum(['FIFO', 'AVCO', 'STANDARD'])
  valuationMethod?: 'FIFO' | 'AVCO' | 'STANDARD';

  @IsOptional()
  @IsBoolean()
  trackLotNumbers?: boolean;

  @IsOptional()
  @IsBoolean()
  trackSerialNumbers?: boolean;

  @IsOptional()
  @IsBoolean()
  trackExpiryDates?: boolean;

  @IsOptional()
  @IsBoolean()
  requireTransferApproval?: boolean;

  @IsOptional()
  @IsBoolean()
  requireAdjustmentApproval?: boolean;

  @IsOptional()
  @IsBoolean()
  enableLowStockAlert?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  defaultMinStock?: number;

  @IsOptional()
  @IsBoolean()
  allowNegativeStock?: boolean;
}

