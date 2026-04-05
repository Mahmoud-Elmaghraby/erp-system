export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: string = 'EGP',
  ) {
    if (amount < 0) throw new Error('Amount cannot be negative');
  }

  static create(amount: number, currency = 'EGP'): Money {
    return new Money(amount, currency);
  }

  getAmount(): number { return this.amount; }
  getCurrency(): string { return this.currency; }
  add(other: Money): Money { return new Money(this.amount + other.amount, this.currency); }
  subtract(other: Money): Money { return new Money(this.amount - other.amount, this.currency); }
  multiply(factor: number): Money { return new Money(this.amount * factor, this.currency); }
  isGreaterThan(other: Money): boolean { return this.amount > other.amount; }
  equals(other: Money): boolean { return this.amount === other.amount && this.currency === other.currency; }
}