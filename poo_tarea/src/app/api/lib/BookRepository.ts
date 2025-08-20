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
      const result = await sql`
        UPDATE books 
        SET 
          title = ${bookData.title},
          description = ${bookData.description},
          author = ${bookData.author},
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
      return { success: true, data: result[0] };
    } catch (error: any) {
      console.error("DB Update Error:", error);
      return { success: false, error: error.message };
    }
  }

  public async deleteBook(id: number): Promise<{ success: boolean; error?: string }> {
    const sql = this.db.getConnection();
    
    try {
      const result = await sql`DELETE FROM books WHERE id = ${id}`;
      return { success: true };
    } catch (error: any) {
      console.error("DB Delete Error:", error);
      return { success: false, error: error.message };
    }
  }

  // Nuevo método para contar libros totales
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
}