import { NextRequest, NextResponse } from "next/server";
import { DependencyContainer } from "./lib/DependencyContainer";
import { IBookService } from "./lib/interfaces/IBookService";

// ... (GET y POST methods)

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

// ... (DELETE method)