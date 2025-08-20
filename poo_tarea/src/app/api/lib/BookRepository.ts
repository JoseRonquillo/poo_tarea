import { DatabaseConnection } from './DatabaseConnection';

export class BookRepository {
  private db: DatabaseConnection;

  constructor() {
    this.db = DatabaseConnection.getInstance();
  }

  public async insertBook(bookData: any): Promise<{ success: boolean; data?: any; error?: string }> {
    const sql = this.db.getConnection();
    
    try {
      const result = await sql`
        INSERT INTO books (id, title, description, author)
        VALUES (${bookData.id}, ${bookData.title}, ${bookData.description}, ${bookData.author})
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
      const result = await sql`SELECT * FROM books ORDER BY id`;
      return { success: true, data: result };
    } catch (error: any) {
      console.error("DB Select Error:", error);
      return { success: false, error: error.message };
    }
  }

  public async getBookById(id: number): Promise<{ success: boolean; data?: any; error?: string }> {
    const sql = this.db.getConnection();
    
    try {
      const result = await sql`SELECT * FROM books WHERE id = ${id}`;
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
        SET title = ${bookData.title}, 
            description = ${bookData.description}, 
            author = ${bookData.author}
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
      await sql`DELETE FROM books WHERE id = ${id}`;
      return { success: true };
    } catch (error: any) {
      console.error("DB Delete Error:", error);
      return { success: false, error: error.message };
    }
  }
}