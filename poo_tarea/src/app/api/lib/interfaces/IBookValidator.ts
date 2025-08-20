export interface IBookValidator {
  validateBook(data: any): string[];
  validateBookUpdate(data: any): string[];
  hasErrors(errors: string[]): boolean;
}