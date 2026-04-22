import { IsUUID, IsOptional, IsNumber, IsEnum, IsDateString, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvoiceDto {
  @IsUUID()
  orderId!: string;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @IsOptional()
  @IsUUID()
  paymentTermId?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  discountAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  taxRate?: number;
}

export class PayInvoiceDto {
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  amount!: number;

  @IsEnum(['CASH', 'BANK_TRANSFER', 'CHEQUE', 'CARD'])
  paymentMethod!: 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'CARD';

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}