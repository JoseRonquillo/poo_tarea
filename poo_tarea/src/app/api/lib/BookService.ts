import { BookValidator } from './BookValidator';
import { BookRepository } from './BookRepository';

export class BookService {
  private bookRepository: BookRepository;

  constructor() {
    this.bookRepository = new BookRepository();
  }

  public async createBook(bookData: any): Promise<{ success: boolean; data?: any; errors?: string[]; error?: string }> {
    // Validar datos
    const errors = BookValidator.validateBook(bookData);
    
    if (BookValidator.hasErrors(errors)) {
      return { success: false, errors };
    }

    // Insertar en la base de datos
    const result = await this.bookRepository.insertBook(bookData);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true, data: result.data };
  }

  public async getAllBooks(): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.bookRepository.getAllBooks();
  }

  public async getBookById(id: number): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.bookRepository.getBookById(id);
  }

  public async updateBook(id: number, bookData: any): Promise<{ success: boolean; data?: any; errors?: string[]; error?: string }> {
    // Validar datos
    const errors = BookValidator.validateBookUpdate(bookData);
    
    if (BookValidator.hasErrors(errors)) {
      return { success: false, errors };
    }

    // Actualizar en la base de datos
    const result = await this.bookRepository.updateBook(id, bookData);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true, data: result.data };
  }

  public async deleteBook(id: number): Promise<{ success: boolean; error?: string }> {
    return await this.bookRepository.deleteBook(id);
  }
}