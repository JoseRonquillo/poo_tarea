import postgres from "postgres";

const connectionString =
  "postgresql://postgres.lkjmbgfbsbrvzleqsqzw:Doritos74@aws-1-us-east-2.pooler.supabase.com:6543/postgres";
const sql = postgres(connectionString);

export async function insertBook(bookData: any) {
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

export async function getAllBooks() {
  try {
    const result = await sql`SELECT * FROM books ORDER BY id`;
    return { success: true, data: result };
  } catch (error: any) {
    console.error("DB Select Error:", error);
    return { success: false, error: error.message };
  }
}