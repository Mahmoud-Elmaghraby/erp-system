export type ValuationMethod = 'FIFO' | 'AVCO' | 'STANDARD';

export class InventorySettingsEntity {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public valuationMethod: ValuationMethod,
    public trackLotNumbers: boolean,
    public trackSerialNumbers: boolean,
    public trackExpiryDates: boolean,
    public requireTransferApproval: boolean,
    public requireAdjustmentApproval: boolean,
    public enableLowStockAlert: boolean,
    public defaultMinStock: number,
    public allowNegativeStock: boolean,
  ) {}

  static create(data: {
    id: string;
    companyId: string;
    valuationMethod?: ValuationMethod;
    trackLotNumbers?: boolean;
    trackSerialNumbers?: boolean;
    trackExpiryDates?: boolean;
    requireTransferApproval?: boolean;
    requireAdjustmentApproval?: boolean;
    enableLowStockAlert?: boolean;
    defaultMinStock?: number;
    allowNegativeStock?: boolean;
  }): InventorySettingsEntity {
    return new InventorySettingsEntity(
      data.id,
      data.companyId,
      data.valuationMethod ?? 'FIFO',
      data.trackLotNumbers ?? false,
      data.trackSerialNumbers ?? false,
      data.trackExpiryDates ?? false,
      data.requireTransferApproval ?? false,
      data.requireAdjustmentApproval ?? false,
      data.enableLowStockAlert ?? true,
      data.defaultMinStock ?? 0,
      data.allowNegativeStock ?? false,
    );
  }

  update(data: Partial<Omit<InventorySettingsEntity, 'id' | 'companyId'>>): void {
    if (data.valuationMethod !== undefined) this.valuationMethod = data.valuationMethod;
    if (data.trackLotNumbers !== undefined) this.trackLotNumbers = data.trackLotNumbers;
    if (data.trackSerialNumbers !== undefined) this.trackSerialNumbers = data.trackSerialNumbers;
    if (data.trackExpiryDates !== undefined) this.trackExpiryDates = data.trackExpiryDates;
    if (data.requireTransferApproval !== undefined) this.requireTransferApproval = data.requireTransferApproval;
    if (data.requireAdjustmentApproval !== undefined) this.requireAdjustmentApproval = data.requireAdjustmentApproval;
    if (data.enableLowStockAlert !== undefined) this.enableLowStockAlert = data.enableLowStockAlert;
    if (data.defaultMinStock !== undefined) this.defaultMinStock = data.defaultMinStock;
    if (data.allowNegativeStock !== undefined) this.allowNegativeStock = data.allowNegativeStock;
  }
}