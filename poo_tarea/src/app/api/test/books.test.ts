import { BookService } from '../lib/BookService';
import { BookRepository } from '../lib/BookRepository';
import { BookValidator } from '../lib/BookValidator';

// Script de prueba para verificar la funcionalidad de obtener todos los libros
async function testGetAllBooks() {
  console.log('🔍 Testing GET All Books functionality...');
  
  const bookService = new BookService(new BookRepository(), new BookValidator());
  
  try {
    const result = await bookService.getAllBooks();
    
    if (result.success) {
      console.log('✅ Successfully retrieved books:');
      console.log(`📚 Total books: ${result.data?.length || 0}`);
      
      if (result.data && result.data.length > 0) {
        result.data.forEach((book: any, index: number) => {
          console.log(`\n--- Book ${index + 1} ---`);
          console.log(`ID: ${book.id}`);
          console.log(`Title: ${book.title}`);
          console.log(`Author: ${book.author}`);
          console.log(`Description: ${book.description.substring(0, 50)}...`);
        });
      } else {
        console.log('No books found in the database.');
      }
    } else {
      console.log('❌ Failed to retrieve books:', result.error);
    }
  } catch (error) {
    console.log('❌ Error testing get all books:', error);
  }
}

testGetAllBooks();