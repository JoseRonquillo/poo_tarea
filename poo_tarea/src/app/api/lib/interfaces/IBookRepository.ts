export interface IBookRepository {
  insertBook(bookData: any): Promise<{ success: boolean; data?: any; error?: string }>;
  getAllBooks(): Promise<{ success: boolean; data?: any; error?: string }>;
  getBookById(id: number): Promise<{ success: boolean; data?: any; error?: string }>;
  updateBook(id: number, bookData: any): Promise<{ success: boolean; data?: any; error?: string }>;
  deleteBook(id: number): Promise<{ success: boolean; error?: string; deletedCount?: number }>;
  getBooksCount(): Promise<{ success: boolean; data?: number; error?: string }>;
  bookExists(id: number): Promise<{ success: boolean; exists?: boolean; error?: string }>;
}