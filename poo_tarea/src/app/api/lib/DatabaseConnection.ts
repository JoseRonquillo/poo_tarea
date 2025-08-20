import postgres from 'postgres';

export class DatabaseConnection {
  private sql: any;
  private static instance: DatabaseConnection;

  private constructor() {
    const connectionString = process.env.DATABASE_URL || "postgresql://postgres.lkjmbgfbsbrvzleqsqzw:Doritos74@aws-1-us-east-2.pooler.supabase.com:6543/postgres";
    this.sql = postgres(connectionString);
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public getConnection() {
    return this.sql;
  }

  public async closeConnection() {
    if (this.sql) {
      await this.sql.end();
    }
  }
}