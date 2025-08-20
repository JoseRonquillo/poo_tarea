import { ValueObject } from './ValueObject';

export class Description extends ValueObject<string> {
  protected validate(value: string): void {
    if (value === undefined || value === null) {
      throw new Error('Description is required');
    }

    if (typeof value !== 'string') {
      throw new Error('Description must be a string');
    }

    const trimmedValue = value.trim();
    
    if (trimmedValue.length === 0) {
      throw new Error('Description cannot be empty');
    }

    if (trimmedValue.length < 10) {
      throw new Error('Description must be at least 10 characters long');
    }

    if (trimmedValue.length > 2000) {
      throw new Error('Description must be less than 2000 characters');
    }
  }

  public static create(value: string): Description {
    return new Description(value.trim());
  }
  
  public static createOptional(value: string | undefined): Description | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }
    return new Description(value.trim());
  }
}