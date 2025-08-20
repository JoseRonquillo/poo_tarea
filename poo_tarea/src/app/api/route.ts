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
          { 
            success: false,
            error: "Failed to fetch book", 
            details: result.error,
            message: "Error retrieving book" 
          },
          { status: 500 }
        );
      }
      
      if (!result.data) {
        return NextResponse.json(
          { 
            success: false,
            error: "Book not found",
            message: "The requested book was not found" 
          },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: result.data,
        message: "Book retrieved successfully"
      });
    } else {
      // Obtener todos los libros
      const [booksResult, countResult] = await Promise.all([
        bookService.getAllBooks(),
        bookService.getBooksCount()
      ]);
      
      if (!booksResult.success) {
        return NextResponse.json(
          { 
            success: false,
            error: "Failed to fetch books", 
            details: booksResult.error,
            message: "Error retrieving books" 
          },
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
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        message: "An unexpected error occurred" 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validar que el cuerpo de la solicitud no esté vacío
    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: "Empty request body",
          message: "Please provide book data (title, description, author)" 
        },
        { status: 400 }
      );
    }

    const container = DependencyContainer.getInstance();
    const bookService = container.resolve<IBookService>('IBookService');
    
    const result = await bookService.createBook(data);

    if (!result.success) {
      if (result.errors) {
        return NextResponse.json(
          { 
            success: false,
            errors: result.errors,
            message: "Validation failed" 
          }, 
          { status: 422 }
        );
      } else {
        return NextResponse.json(
          { 
            success: false,
            error: result.error,
            message: "Failed to create book" 
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: "Book created successfully"
    }, { status: 201 });
    
  } catch (error: any) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error", 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        message: "An unexpected error occurred while creating the book" 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false,
          error: "ID parameter is required",
          message: "Please provide a book ID in the query parameters" 
        },
        { status: 400 }
      );
    }

    const data = await request.json();
    
    // Validar que el cuerpo de la solicitud no esté vacío
    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: "Empty request body",
          message: "Please provide at least one field to update (title, description, or author)" 
        },
        { status: 400 }
      );
    }

    const container = DependencyContainer.getInstance();
    const bookService = container.resolve<IBookService>('IBookService');
    
    const result = await bookService.updateBook(Number(id), data);

    if (!result.success) {
      if (result.errors) {
        return NextResponse.json(
          { 
            success: false,
            errors: result.errors,
            message: "Validation failed" 
          }, 
          { status: 422 }
        );
      } else {
        return NextResponse.json(
          { 
            success: false,
            error: result.error,
            message: "Failed to update book" 
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: "Book updated successfully"
    });
    
  } catch (error: any) {
    console.error("Error in PUT handler:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error", 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        message: "An unexpected error occurred while updating the book" 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false,
          error: "ID parameter is required",
          message: "Please provide a book ID in the query parameters" 
        },
        { status: 400 }
      );
    }

    // Validar que el ID sea un número válido
    const numericId = Number(id);
    if (isNaN(numericId) || numericId <= 0) {
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid ID format",
          message: "Book ID must be a positive number" 
        },
        { status: 400 }
      );
    }

    const container = DependencyContainer.getInstance();
    const bookService = container.resolve<IBookService>('IBookService');
    
    const result = await bookService.deleteBook(numericId);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false,
          error: result.error,
          message: "Failed to delete book",
          deletedCount: result.deletedCount || 0
        },
        { status: result.error?.includes('not found') ? 404 : 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Book deleted successfully",
      deletedCount: result.deletedCount || 1,
      deletedId: numericId
    });
    
  } catch (error: any) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error", 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        message: "An unexpected error occurred while deleting the book" 
      },
      { status: 500 }
    );
  }
}

export async function HEAD(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new NextResponse(null, { 
        status: 400,
        headers: { 'X-Error': 'ID parameter is required' }
      });
    }

    const numericId = Number(id);
    if (isNaN(numericId) || numericId <= 0) {
      return new NextResponse(null, { 
        status: 400,
        headers: { 'X-Error': 'Invalid ID format' }
      });
    }

    const container = DependencyContainer.getInstance();
    const bookService = container.resolve<IBookService>('IBookService');
    
    const result = await bookService.checkBookExists(numericId);

    if (!result.success) {
      return new NextResponse(null, { 
        status: 500,
        headers: { 'X-Error': result.error || 'Error checking book existence' }
      });
    }

    return new NextResponse(null, { 
      status: result.exists ? 200 : 404,
      headers: { 
        'X-Book-Exists': result.exists ? 'true' : 'false',
        'X-Book-ID': id
      }
    });
    
  } catch (error: any) {
    console.error("Error in HEAD handler:", error);
    return new NextResponse(null, { 
      status: 500,
      headers: { 'X-Error': 'Internal server error' }
    });
  }
}