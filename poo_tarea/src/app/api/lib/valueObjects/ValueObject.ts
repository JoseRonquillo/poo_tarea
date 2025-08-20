export abstract class ValueObject<T> {
  protected readonly value: T;

  constructor(value: T) {
    this.value = value;
    this.validate(value);
  }

  protected abstract validate(value: T): void;

  public getValue(): T {
    return this.value;
  }

  public toString(): string {
    return String(this.value);
  }

  public equals(other: ValueObject<T>): boolean {
    return this.value === other.getValue();
  }
}