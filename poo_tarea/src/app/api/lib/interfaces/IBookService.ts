export interface IBookService {
  createBook(bookData: any): Promise<{ success: boolean; data?: any; errors?: string[]; error?: string }>;
  getAllBooks(): Promise<{ success: boolean; data?: any; error?: string }>;
  getBookById(id: number): Promise<{ success: boolean; data?: any; error?: string }>;
  updateBook(id: number, bookData: any): Promise<{ success: boolean; data?: any; errors?: string[]; error?: string }>;
  deleteBook(id: number): Promise<{ success: boolean; error?: string }>;
}