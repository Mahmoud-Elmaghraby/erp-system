export class UpdateInventorySettingsDto {
  valuationMethod?: 'FIFO' | 'AVCO' | 'STANDARD';
  trackLotNumbers?: boolean;
  trackSerialNumbers?: boolean;
  trackExpiryDates?: boolean;
  requireTransferApproval?: boolean;
  requireAdjustmentApproval?: boolean;
  enableLowStockAlert?: boolean;
  defaultMinStock?: number;
  allowNegativeStock?: boolean;
}