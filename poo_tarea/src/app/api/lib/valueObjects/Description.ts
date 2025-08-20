import { ValueObject } from './ValueObject';

export class Description extends ValueObject<string> {
  protected validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Description is required');
    }

    if (typeof value !== 'string') {
      throw new Error('Description must be a string');
    }

    if (value.length < 10) {
      throw new Error('Description must be at least 10 characters long');
    }

    if (value.length > 2000) {
      throw new Error('Description must be less than 2000 characters');
    }
  }

  public static create(value: string): Description {
    return new Description(value.trim());
  }
}
