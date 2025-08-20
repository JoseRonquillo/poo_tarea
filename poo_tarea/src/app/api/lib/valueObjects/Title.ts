import { ValueObject } from './ValueObject';

export class Title extends ValueObject<string> {
  protected validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Title is required');
    }

    if (typeof value !== 'string') {
      throw new Error('Title must be a string');
    }

    if (value.length < 3) {
      throw new Error('Title must be at least 3 characters long');
    }

    if (value.length > 255) {
      throw new Error('Title must be less than 255 characters');
    }
  }

  public static create(value: string): Title {
    return new Title(value.trim());
  }
}