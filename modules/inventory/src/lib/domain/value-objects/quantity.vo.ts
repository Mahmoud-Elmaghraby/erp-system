export class Quantity {
  private constructor(private readonly value: number) {}

  static create(value: number): Quantity {
    return new Quantity(value);
  }

  getValue(): number { return this.value; }

  add(other: Quantity): Quantity {
    return new Quantity(this.value + other.value);
  }

  subtract(other: Quantity): Quantity {
    // ✅ مش بنمنع السالب هنا — المنع بيتم في الـ use case
    return new Quantity(this.value - other.value);
  }

  isGreaterThan(other: Quantity): boolean { return this.value > other.value; }
  isZero(): boolean { return this.value === 0; }
  equals(other: Quantity): boolean { return this.value === other.value; }
}