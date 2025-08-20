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
      
      return NextResponse.json(result.data);
    } else {
      // Obtener todos los libros
      const result = await bookService.getAllBooks();
      
      if (!result.success) {
        return NextResponse.json(
          { error: "Failed to fetch books", details: result.error },
          { status: 500 }
        );
      }
      
      return NextResponse.json(result.data);
    }
  } catch (error: any) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const container = DependencyContainer.getInstance();
    const bookService = container.resolve<IBookService>('IBookService');
    
    const result = await bookService.createBook(data);

    if (!result.success) {
      if (result.errors) {
        return NextResponse.json({ errors: result.errors }, { status: 422 });
      } else {
        return NextResponse.json(
          { error: "Failed to insert book", details: result.error },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message: "Book inserted successfully",
      book: result.data,
    });
  } catch (error: any) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: "ID parameter is required" },
        { status: 400 }
      );
    }
    
    const container = DependencyContainer.getInstance();
    const bookService = container.resolve<IBookService>('IBookService');
    
    const result = await bookService.updateBook(Number(id), data);

    if (!result.success) {
      if (result.errors) {
        return NextResponse.json({ errors: result.errors }, { status: 422 });
      } else {
        return NextResponse.json(
          { error: "Failed to update book", details: result.error },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message: "Book updated successfully",
      book: result.data,
    });
  } catch (error: any) {
    console.error("Error in PUT handler:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
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
        { error: "ID parameter is required" },
        { status: 400 }
      );
    }
    
    const container = DependencyContainer.getInstance();
    const bookService = container.resolve<IBookService>('IBookService');
    
    const result = await bookService.deleteBook(Number(id));

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to delete book", details: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Book deleted successfully",
    });
  } catch (error: any) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}