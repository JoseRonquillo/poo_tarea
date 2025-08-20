import { IBookService } from './interfaces/IBookService';
import { IBookValidator } from './interfaces/IBookValidator';
import { IBookRepository } from './interfaces/IBookRepository';
import { BookValidator } from './BookValidator';
import { BookRepository } from './BookRepository';
import { ValueObjectFactory } from './valueObjects/ValueObjectFactory';

export class BookService implements IBookService {
  private bookRepository: IBookRepository;
  private bookValidator: IBookValidator;

  constructor(
    bookRepository?: IBookRepository,
    bookValidator?: IBookValidator
  ) {
    this.bookRepository = bookRepository || new BookRepository();
    this.bookValidator = bookValidator || new BookValidator();
  }

  public async createBook(bookData: any): Promise<{ success: boolean; data?: any; errors?: string[]; error?: string }> {
    const errors = this.bookValidator.validateBook(bookData);
    
    if (this.bookValidator.hasErrors(errors)) {
      return { success: false, errors };
    }

    try {
      const title = ValueObjectFactory.createTitle(bookData.title);
      const description = ValueObjectFactory.createDescription(bookData.description);
      const author = ValueObjectFactory.createAuthor(bookData.author);

      const dbData = {
        title: title.getValue(),
        description: description.getValue(),
        author: author.getValue()
      };

      const result = await this.bookRepository.insertBook(dbData);
      
      if (!result.success) {
        return { success: false, error: result.error };
      }

      return { success: true, data: result.data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  public async getAllBooks(): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.bookRepository.getAllBooks();
  }

  public async getBooksCount(): Promise<{ success: boolean; data?: number; error?: string }> {
    return await this.bookRepository.getBooksCount();
  }

  public async getBookById(id: number): Promise<{ success: boolean; data?: any; error?: string }> {
    try {

      const bookId = ValueObjectFactory.createBookId(id);
      return await this.bookRepository.getBookById(bookId.getValue());
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  public async updateBook(id: number, bookData: any): Promise<{ success: boolean; data?: any; errors?: string[]; error?: string }> {
    const errors = this.bookValidator.validateBookUpdate(bookData);
    
    if (this.bookValidator.hasErrors(errors)) {
      return { success: false, errors };
    }

    try {
      const bookId = ValueObjectFactory.createBookId(id);

      const updateData: any = {};
      
      if (bookData.title !== undefined) {
        const title = ValueObjectFactory.createTitle(bookData.title);
        updateData.title = title.getValue();
      }
      
      if (bookData.description !== undefined) {
        const description = ValueObjectFactory.createDescription(bookData.description);
        updateData.description = description.getValue();
      }
      
      if (bookData.author !== undefined) {
        const author = ValueObjectFactory.createAuthor(bookData.author);
        updateData.author = author.getValue();
      }

      const result = await this.bookRepository.updateBook(bookId.getValue(), updateData);
      
      if (!result.success) {
        return { success: false, error: result.error };
      }

      return { success: true, data: result.data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  public async deleteBook(id: number): Promise<{ success: boolean; error?: string }> {
    try {
      const bookId = ValueObjectFactory.createBookId(id);
      return await this.bookRepository.deleteBook(bookId.getValue());
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}