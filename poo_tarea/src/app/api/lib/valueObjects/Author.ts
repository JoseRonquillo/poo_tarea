import { ValueObject } from './ValueObject';

export class Author extends ValueObject<string> {
  protected validate(value: string): void {
    if (value === undefined || value === null) {
      throw new Error('Author is required');
    }

    if (typeof value !== 'string') {
      throw new Error('Author must be a string');
    }

    const trimmedValue = value.trim();
    
    if (trimmedValue.length === 0) {
      throw new Error('Author cannot be empty');
    }

    if (trimmedValue.length < 2) {
      throw new Error('Author must be at least 2 characters long');
    }

    if (trimmedValue.length > 100) {
      throw new Error('Author must be less than 100 characters');
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(trimmedValue)) {
      throw new Error('Author must contain only letters and spaces');
    }
  }

  public static create(value: string): Author {
    return new Author(value.trim());
  }
  
  public static createOptional(value: string | undefined): Author | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }
    return new Author(value.trim());
  }
}