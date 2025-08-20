export interface IDatabaseConnection {
  getConnection(): any;
  closeConnection(): Promise<void>;
}