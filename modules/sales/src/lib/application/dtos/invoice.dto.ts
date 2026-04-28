import { IsUUID, IsOptional, IsNumber, IsEnum, IsDateString, Min, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsIn } from 'class-validator';

// ── Item DTO for direct invoice creation ─────────────────────────────

export class CreateInvoiceItemDto {
  @IsUUID()
  productId!: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity!: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  unitPrice!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  discount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  tax?: number;

  @IsOptional()
  @IsUUID()
  taxId?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  total?: number;
}

// ── Create Invoice from an existing Order ────────────────────────────

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

// ── Create Direct Invoice (without a pre-existing order) ─────────────

export class CreateDirectInvoiceDto {
  @IsUUID()
  customerId!: string;

  @IsUUID()
  branchId!: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  paymentTerms?: number;

  @IsOptional()
  @IsUUID()
  paymentTermId?: string;

  @IsOptional()
  @IsString()
  salesRepId?: string;

  @IsOptional()
  @IsString()
  method?: string;

  // ── Amounts (calculated on frontend, validated/recalculated on backend) ──

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  untaxedAmount?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  taxAmount?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discountAmount?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalAmount?: number;

  // ── Discount / Settlement tab ──

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  overallDiscount?: number;

  @IsOptional()
  @IsString()
  overallDiscountType?: string; // 'percentage' | 'fixed'

  // ── Deposit tab ──

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  advancePayment?: number;

  @IsOptional()
  @IsString()
  advancePaymentType?: string; // 'amount' | 'percentage'

  @IsOptional()
  @IsIn(['unpaid', 'partially_paid', 'paid'])
  paymentStatus?: 'unpaid' | 'partially_paid' | 'paid';

  // ── Shipping tab ──

  @IsOptional()
  @IsString()
  shippingDetails?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  shippingCost?: number;

  // ── Draft mode ──

  @IsOptional()
  @IsString()
  saveMode?: string; // 'draft' | 'confirm' | 'print'

  // ── Line items ──

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items!: CreateInvoiceItemDto[];
}

// ── Pay Invoice ──────────────────────────────────────────────────────

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