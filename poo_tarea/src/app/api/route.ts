import { NextRequest, NextResponse } from "next/server";
import { insertBook } from "./lib/dbFunctions";
import { validateBook } from "./lib/validationFunctions";

export async function GET() {
  return NextResponse.json({
    message: "Hola desde la Books API",
  });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const errors = validateBook(data);

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const result = await insertBook(data);

  if (!result.success) {
    return NextResponse.json(
      { error: "Failed to insert book", details: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Book inserted successfully",
    book: result.data,
  });
}