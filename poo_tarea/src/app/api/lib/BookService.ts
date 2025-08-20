import { BookValidator } from './BookValidator';
import { BookRepository } from './BookRepository';
import { ValueObjectFactory } from './valueObjects/ValueObjectFactory';

export class BookService {
  private bookRepository: BookRepository;

  constructor() {
    this.bookRepository = new BookRepository();
  }

  public async createBook(bookData: any): Promise<{ success: boolean; data?: any; errors?: string[]; error?: string }> {

    const errors = BookValidator.validateBook(bookData);
    
    if (BookValidator.hasErrors(errors)) {
      return { success: false, errors };
    }

    try {
      const bookId = ValueObjectFactory.createBookId(bookData.id);
      const title = ValueObjectFactory.createTitle(bookData.title);
      const description = ValueObjectFactory.createDescription(bookData.description);
      const author = ValueObjectFactory.createAuthor(bookData.author);

      const dbData = {
        id: bookId.getValue(),
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

  public async getBookById(id: number): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const bookId = ValueObjectFactory.createBookId(id);
      return await this.bookRepository.getBookById(bookId.getValue());
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  public async updateBook(id: number, bookData: any): Promise<{ success: boolean; data?: any; errors?: string[]; error?: string }> {
    const errors = BookValidator.validateBookUpdate(bookData);
    
    if (BookValidator.hasErrors(errors)) {
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