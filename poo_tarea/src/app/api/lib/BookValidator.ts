import { ValueObjectFactory } from './valueObjects/ValueObjectFactory';

export class BookValidator {
  public static validateBook(data: any): string[] {
    const errors: string[] = [];

    try {
      if (data.id !== undefined) {
        ValueObjectFactory.createBookId(data.id);
      }
    } catch (error: any) {
      errors.push(error.message);
    }

    try {
      ValueObjectFactory.createTitle(data.title || '');
    } catch (error: any) {
      errors.push(error.message);
    }

    try {
      ValueObjectFactory.createDescription(data.description || '');
    } catch (error: any) {
      errors.push(error.message);
    }

    try {
      ValueObjectFactory.createAuthor(data.author || '');
    } catch (error: any) {
      errors.push(error.message);
    }

    return errors;
  }

  public static validateBookUpdate(data: any): string[] {
    const errors: string[] = [];

    if (data.title !== undefined) {
      try {
        ValueObjectFactory.createTitle(data.title);
      } catch (error: any) {
        errors.push(error.message);
      }
    }

    if (data.description !== undefined) {
      try {
        ValueObjectFactory.createDescription(data.description);
      } catch (error: any) {
        errors.push(error.message);
      }
    }

    if (data.author !== undefined) {
      try {
        ValueObjectFactory.createAuthor(data.author);
      } catch (error: any) {
        errors.push(error.message);
      }
    }

    return errors;
  }

  public static hasErrors(errors: string[]): boolean {
    return errors.length > 0;
  }
}