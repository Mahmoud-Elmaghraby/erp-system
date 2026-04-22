import { Quantity } from '../value-objects/quantity.vo';

export class StockEntity {
  constructor(
    public readonly id: string,
    public readonly warehouseId: string,
    public readonly productId: string,
    public quantity: Quantity,
    public minStock: Quantity,
  ) {}

  addQuantity(amount: Quantity): void {
    this.quantity = this.quantity.add(amount);
  }

  removeQuantity(amount: Quantity): void {
    this.quantity = this.quantity.subtract(amount);
  }

  isBelowMinStock(): boolean {
    return !this.quantity.isGreaterThan(this.minStock);
  }
}