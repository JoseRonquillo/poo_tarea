import { IBookRepository } from './interfaces/IBookRepository';
import { IDatabaseConnection } from './interfaces/IDatabaseConnection';
import { DatabaseConnection } from './DatabaseConnection';

export class BookRepository implements IBookRepository {
  private db: IDatabaseConnection;

  constructor(databaseConnection?: IDatabaseConnection) {
    this.db = databaseConnection || DatabaseConnection.getInstance();
  }

  public async insertBook(bookData: any): Promise<{ success: boolean; data?: any; error?: string }> {
    const sql = this.db.getConnection();
    
    try {
      const result = await sql`
        INSERT INTO books (title, description, author)
        VALUES (${bookData.title}, ${bookData.description}, ${bookData.author})
        RETURNING *
      `;
      return { success: true, data: result[0] };
    } catch (error: any) {
      console.error("DB Insert Error:", error);
      return { success: false, error: error.message };
    }
  }

  public async getAllBooks(): Promise<{ success: boolean; data?: any; error?: string }> {
    const sql = this.db.getConnection();
    
    try {
      const result = await sql`
        SELECT 
          id,
          title,
          description,
          author,
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM books 
        ORDER BY created_at DESC
      `;
      return { success: true, data: result };
    } catch (error: any) {
      console.error("DB Select Error:", error);
      return { success: false, error: error.message };
    }
  }

  public async getBookById(id: number): Promise<{ success: boolean; data?: any; error?: string }> {
    const sql = this.db.getConnection();
    
    try {
      const result = await sql`
        SELECT 
          id,
          title,
          description,
          author,
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM books 
        WHERE id = ${id}
      `;
      return { success: true, data: result.length > 0 ? result[0] : null };
    } catch (error: any) {
      console.error("DB Select Error:", error);
      return { success: false, error: error.message };
    }
  }

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

  public async deleteBook(id: number): Promise<{ success: boolean; error?: string; deletedCount?: number }> {
    const sql = this.db.getConnection();
    
    try {
      // Primero verificar si el libro existe
      const checkResult = await sql`SELECT id FROM books WHERE id = ${id}`;
      
      if (checkResult.length === 0) {
        return { 
          success: false, 
          error: 'Book not found',
          deletedCount: 0
        };
      }

      // Eliminar el libro
      const result = await sql`DELETE FROM books WHERE id = ${id}`;
      
      return { 
        success: true, 
        deletedCount: result.count
      };
    } catch (error: any) {
      console.error("DB Delete Error:", error);
      
      // Manejar errores específicos de la base de datos
      if (error.code === '23503') { // Foreign key violation
        return { 
          success: false, 
          error: 'Cannot delete book because it is referenced by other records' 
        };
      }
      
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  public async getBooksCount(): Promise<{ success: boolean; data?: number; error?: string }> {
    const sql = this.db.getConnection();
    
    try {
      const result = await sql`SELECT COUNT(*) as count FROM books`;
      return { success: true, data: Number(result[0].count) };
    } catch (error: any) {
      console.error("DB Count Error:", error);
      return { success: false, error: error.message };
    }
  }

  public async bookExists(id: number): Promise<{ success: boolean; exists?: boolean; error?: string }> {
    const sql = this.db.getConnection();
    
    try {
      const result = await sql`SELECT 1 FROM books WHERE id = ${id}`;
      return { success: true, exists: result.length > 0 };
    } catch (error: any) {
      console.error("DB Exists Check Error:", error);
      return { success: false, error: error.message };
    }
  }
}