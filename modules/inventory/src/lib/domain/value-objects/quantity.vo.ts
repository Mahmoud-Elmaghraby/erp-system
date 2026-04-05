export class Quantity {
  private constructor(private readonly value: number) {
    if (value < 0) throw new Error('Quantity cannot be negative');
  }

  static create(value: number): Quantity { return new Quantity(value); }
  getValue(): number { return this.value; }
  add(other: Quantity): Quantity { return new Quantity(this.value + other.value); }
  subtract(other: Quantity): Quantity {
    if (this.value < other.value) throw new Error('Insufficient quantity');
    return new Quantity(this.value - other.value);
  }
  isGreaterThan(other: Quantity): boolean { return this.value > other.value; }
  isZero(): boolean { return this.value === 0; }
  equals(other: Quantity): boolean { return this.value === other.value; }
}