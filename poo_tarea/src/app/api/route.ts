import { NextRequest, NextResponse } from "next/server";
import { DependencyContainer } from "./lib/DependencyContainer";
import { IBookService } from "./lib/interfaces/IBookService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const container = DependencyContainer.getInstance();
    const bookService = container.resolve<IBookService>('IBookService');
    
    if (id) {
      // Obtener un libro específico
      const result = await bookService.getBookById(Number(id));
      
      if (!result.success) {
        return NextResponse.json(
          { error: "Failed to fetch book", details: result.error },
          { status: 500 }
        );
      }
      
      if (!result.data) {
        return NextResponse.json(
          { error: "Book not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: result.data
      });
    } else {
      // Obtener todos los libros
      const [booksResult, countResult] = await Promise.all([
        bookService.getAllBooks(),
        bookService.getBooksCount()
      ]);
      
      if (!booksResult.success) {
        return NextResponse.json(
          { error: "Failed to fetch books", details: booksResult.error },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: booksResult.data || [],
        count: countResult.success ? countResult.data : 0,
        message: booksResult.data && booksResult.data.length > 0 
          ? "Books retrieved successfully" 
          : "No books found"
      });
    }
  } catch (error: any) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error", 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}

// ... (los métodos POST, PUT, DELETE permanecen iguales)