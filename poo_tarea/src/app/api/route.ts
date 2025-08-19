import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";

const connectionString =
  "postgresql://postgres.lkjmbgfbsbrvzleqsqzw:Doritos74@aws-1-us-east-2.pooler.supabase.com:6543/postgres";
const sql = postgres(connectionString);

function validateBook(data: any) {
  const errors: string[] = [];

  if (!data.id) {
    errors.push("id is required");
  } else if (typeof data.id !== "number") {
    errors.push("id must be a number");
  }

  if (!data.title) {
    errors.push("title is required");
  } else if (typeof data.title !== "string") {
    errors.push("title must be a string");
  } else if (data.title.length < 3) {
    errors.push("title must be at least 3 characters long");
  }

  if (!data.description) {
    errors.push("description is required");
  } else if (typeof data.description !== "string") {
    errors.push("description must be a string");
  } else if (data.description.length < 10) {
    errors.push("description must be at least 10 characters long");
  }

  if (!data.author) {
    errors.push("author is required");
  } else if (typeof data.author !== "string") {
    errors.push("author must be a string");
  } else if (!/^[a-zA-Z\s]+$/.test(data.author)) {
    errors.push("author must contain only letters and spaces");
  }

  return errors;
}

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

  try {
    await sql`
      INSERT INTO books (id, title, description, author)
      VALUES (${data.id}, ${data.title}, ${data.description}, ${data.author})
    `;

    return NextResponse.json({
      message: "Book inserted successfully",
      book: data,
    });
  } catch (error: any) {
    console.error("DB Insert Error:", error);
    return NextResponse.json(
      { error: "Failed to insert book", details: error.message },
      { status: 500 }
    );
  }
}
