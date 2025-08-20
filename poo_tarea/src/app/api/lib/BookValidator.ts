import { IBookValidator } from './interfaces/IBookValidator';
import { ValueObjectFactory } from './valueObjects/ValueObjectFactory';

export class BookValidator implements IBookValidator {
  public validateBook(data: any): string[] {
    const errors: string[] = [];

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

  public validateBookUpdate(data: any): string[] {
    const errors: string[] = [];

    const hasFieldsToUpdate = 
      data.title !== undefined || 
      data.description !== undefined || 
      data.author !== undefined;
    
    if (!hasFieldsToUpdate) {
      errors.push('At least one field (title, description, or author) must be provided for update');
    }


    if (data.title !== undefined) {
      try {
        ValueObjectFactory.createTitleOptional(data.title);
      } catch (error: any) {
        errors.push(error.message);
      }
    }

    if (data.description !== undefined) {
      try {
        ValueObjectFactory.createDescriptionOptional(data.description);
      } catch (error: any) {
        errors.push(error.message);
      }
    }

    if (data.author !== undefined) {
      try {
        ValueObjectFactory.createAuthorOptional(data.author);
      } catch (error: any) {
        errors.push(error.message);
      }
    }

    return errors;
  }

  public hasErrors(errors: string[]): boolean {
    return errors.length > 0;
  }
}