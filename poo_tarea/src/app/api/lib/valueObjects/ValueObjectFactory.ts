import { Title } from './Title';
import { Description } from './Description';
import { Author } from './Author';
import { BookId } from './BookId';

export class ValueObjectFactory {
  public static createTitle(value: string): Title {
    try {
      return Title.create(value);
    } catch (error) {
      throw new Error(`Invalid title: ${error.message}`);
    }
  }

  public static createDescription(value: string): Description {
    try {
      return Description.create(value);
    } catch (error) {
      throw new Error(`Invalid description: ${error.message}`);
    }
  }

  public static createAuthor(value: string): Author {
    try {
      return Author.create(value);
    } catch (error) {
      throw new Error(`Invalid author: ${error.message}`);
    }
  }

  public static createBookId(value: number): BookId {
    try {
      return BookId.create(value);
    } catch (error) {
      throw new Error(`Invalid book ID: ${error.message}`);
    }
  }
}