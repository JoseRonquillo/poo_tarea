import { ValueObject } from './ValueObject';

export class BookId extends ValueObject<number> {
  protected validate(value: number): void {
    if (value === undefined || value === null) {
      throw new Error('Book ID is required');
    }

    if (typeof value !== 'number') {
      throw new Error('Book ID must be a number');
    }

    if (value <= 0) {
      throw new Error('Book ID must be a positive number');
    }

    if (!Number.isInteger(value)) {
      throw new Error('Book ID must be an integer');
    }
  }

  public static create(value: number): BookId {
    return new BookId(value);
  }
}