import { ValueObject } from './ValueObject';

export class Author extends ValueObject<string> {
  protected validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Author is required');
    }

    if (typeof value !== 'string') {
      throw new Error('Author must be a string');
    }

    if (value.length < 2) {
      throw new Error('Author must be at least 2 characters long');
    }

    if (value.length > 100) {
      throw new Error('Author must be less than 100 characters');
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
      throw new Error('Author must contain only letters and spaces');
    }
  }

  public static create(value: string): Author {
    return new Author(value.trim());
  }
}