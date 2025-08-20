import { ValueObject } from './ValueObject';

export class Title extends ValueObject<string> {
  protected validate(value: string): void {
    if (value === undefined || value === null) {
      throw new Error('Title is required');
    }

    if (typeof value !== 'string') {
      throw new Error('Title must be a string');
    }

    const trimmedValue = value.trim();
    
    if (trimmedValue.length === 0) {
      throw new Error('Title cannot be empty');
    }

    if (trimmedValue.length < 3) {
      throw new Error('Title must be at least 3 characters long');
    }

    if (trimmedValue.length > 255) {
      throw new Error('Title must be less than 255 characters');
    }
  }

  public static create(value: string): Title {
    return new Title(value.trim());
  }
  
  public static createOptional(value: string | undefined): Title | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }
    return new Title(value.trim());
  }
}