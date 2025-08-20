import { IBookRepository } from './interfaces/IBookRepository';
import { IDatabaseConnection } from './interfaces/IDatabaseConnection';
import { DatabaseConnection } from './DatabaseConnection';

export class BookRepository implements IBookRepository {
  private db: IDatabaseConnection;

  constructor(databaseConnection?: IDatabaseConnection) {
    this.db = databaseConnection || DatabaseConnection.getInstance();
  }

  // ... (métodos existentes: insertBook, getAllBooks, getBookById, deleteBook, getBooksCount)

  public async updateBook(id: number, bookData: any): Promise<{ success: boolean; data?: any; error?: string }> {
    const sql = this.db.getConnection();
    
    try {
      // Construir dinámicamente la consulta UPDATE basada en los campos proporcionados
      const fieldsToUpdate: string[] = [];
      const values: any[] = [];

      if (bookData.title !== undefined) {
        fieldsToUpdate.push('title');
        values.push(bookData.title);
      }

      if (bookData.description !== undefined) {
        fieldsToUpdate.push('description');
        values.push(bookData.description);
      }

      if (bookData.author !== undefined) {
        fieldsToUpdate.push('author');
        values.push(bookData.author);
      }

      // Siempre actualizar updated_at
      fieldsToUpdate.push('updated_at');
      values.push(new Date());

      if (fieldsToUpdate.length === 0) {
        return { success: false, error: 'No fields to update' };
      }

      // Construir la consulta SQL dinámicamente
      const setClause = fieldsToUpdate.map((field, index) => 
        `${field} = $${index + 1}`
      ).join(', ');

      const query = `
        UPDATE books 
        SET ${setClause}
        WHERE id = $${fieldsToUpdate.length + 1}
        RETURNING *
      `;

      values.push(id);

      const result = await sql.unsafe(query, values);
      
      if (result.length === 0) {
        return { success: false, error: 'Book not found' };
      }

      return { success: true, data: result[0] };
    } catch (error: any) {
      console.error("DB Update Error:", error);
      return { success: false, error: error.message };
    }
  }

  // ... (otros métodos)
}