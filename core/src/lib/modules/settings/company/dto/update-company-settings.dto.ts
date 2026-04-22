import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean, IsInt, IsOptional, IsString, Max, Min,
} from 'class-validator';

export class UpdateCompanySettingsDto {
  // ===== General =====
  @ApiPropertyOptional({ example: 'EGP' })
  @IsString() @IsOptional()
  defaultCurrency?: string;

  @ApiPropertyOptional({ example: 1, description: 'شهر بداية السنة المالية (1-12)' })
  @IsInt() @Min(1) @Max(12) @IsOptional()
  fiscalYearStart?: number;

  @ApiPropertyOptional()
  @IsBoolean() @IsOptional()
  taxIncludedInPrice?: boolean;

  // ===== Document Prefixes =====
  @ApiPropertyOptional({ example: 'SO' })
  @IsString() @IsOptional()
  salesOrderPrefix?: string;

  @ApiPropertyOptional({ example: 'PO' })
  @IsString() @IsOptional()
  purchaseOrderPrefix?: string;

  @ApiPropertyOptional({ example: 'INV' })
  @IsString() @IsOptional()
  invoicePrefix?: string;

  @ApiPropertyOptional({ example: 'REC' })
  @IsString() @IsOptional()
  receiptPrefix?: string;

  @ApiPropertyOptional({ example: 'BILL' })
  @IsString() @IsOptional()
  billPrefix?: string;

  @ApiPropertyOptional({ example: 'QUO' })
  @IsString() @IsOptional()
  quotationPrefix?: string;

  @ApiPropertyOptional({ example: 'RFQ' })
  @IsString() @IsOptional()
  rfqPrefix?: string;

  @ApiPropertyOptional({ example: 'DEL' })
  @IsString() @IsOptional()
  deliveryPrefix?: string;

  @ApiPropertyOptional({ example: 'RET' })
  @IsString() @IsOptional()
  returnPrefix?: string;

  @ApiPropertyOptional({ example: 'SHP' })
  @IsString() @IsOptional()
  shipmentPrefix?: string;

  // ===== E-Invoice Info =====
  @ApiPropertyOptional({ example: 'EG' })
  @IsString() @IsOptional()
  country?: string;

  @ApiPropertyOptional({ example: '123456789' })
  @IsString() @IsOptional()
  taxRegNumber?: string;

  @ApiPropertyOptional({ example: '12345' })
  @IsString() @IsOptional()
  commercialReg?: string;

  @ApiPropertyOptional({ example: '1234' })
  @IsString() @IsOptional()
  activityCode?: string;

  // ===== ETA (Egypt) =====
  @ApiPropertyOptional()
  @IsBoolean() @IsOptional()
  etaEnabled?: boolean;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  etaClientId?: string;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  etaClientSecret?: string;

  @ApiPropertyOptional({ enum: ['sandbox', 'production'] })
  @IsString() @IsOptional()
  etaEnvironment?: string;

  // ===== ZATCA (Saudi) =====
  @ApiPropertyOptional()
  @IsBoolean() @IsOptional()
  zatcaEnabled?: boolean;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  zatcaCSID?: string;

  @ApiPropertyOptional({ enum: ['sandbox', 'production'] })
  @IsString() @IsOptional()
  zatcaEnvironment?: string;
}