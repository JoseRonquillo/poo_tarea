import { IBookService } from './interfaces/IBookService';
import { IBookValidator } from './interfaces/IBookValidator';
import { IBookRepository } from './interfaces/IBookRepository';
import { BookValidator } from './BookValidator';
import { BookRepository } from './BookRepository';
import { ValueObjectFactory } from './valueObjects/ValueObjectFactory';

export class BookService implements IBookService {
  // ... (constructor y otros métodos)

  public async updateBook(id: number, bookData: any): Promise<{ success: boolean; data?: any; errors?: string[]; error?: string }> {
    try {
      // Validar ID usando Value Object
      const bookId = ValueObjectFactory.createBookId(id);

      // Validar datos de actualización
      const errors = this.bookValidator.validateBookUpdate(bookData);
      
      if (this.bookValidator.hasErrors(errors)) {
        return { success: false, errors };
      }

      // Preparar datos para la actualización
      const updateData: any = {};
      
      if (bookData.title !== undefined) {
        const title = ValueObjectFactory.createTitleOptional(bookData.title);
        if (title) updateData.title = title.getValue();
      }
      
      if (bookData.description !== undefined) {
        const description = ValueObjectFactory.createDescriptionOptional(bookData.description);
        if (description) updateData.description = description.getValue();
      }
      
      if (bookData.author !== undefined) {
        const author = ValueObjectFactory.createAuthorOptional(bookData.author);
        if (author) updateData.author = author.getValue();
      }

      // Verificar que hay al menos un campo para actualizar
      if (Object.keys(updateData).length === 0) {
        return { 
          success: false, 
          errors: ['No valid fields provided for update'] 
        };
      }

      // Actualizar en la base de datos
      const result = await this.bookRepository.updateBook(bookId.getValue(), updateData);
      
      if (!result.success) {
        return { success: false, error: result.error };
      }

      return { success: true, data: result.data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // ... (otros métodos)
}