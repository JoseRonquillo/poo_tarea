import { IDatabaseConnection } from './interfaces/IDatabaseConnection';
import { IBookRepository } from './interfaces/IBookRepository';
import { IBookValidator } from './interfaces/IBookValidator';
import { IBookService } from './interfaces/IBookService';
import { DatabaseConnection } from './DatabaseConnection';
import { BookRepository } from './BookRepository';
import { BookValidator } from './BookValidator';
import { BookService } from './BookService';

export class DependencyContainer {
  private static instance: DependencyContainer;
  private dependencies: Map<string, any> = new Map();

  private constructor() {
    this.registerDependencies();
  }

  public static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }

  private registerDependencies(): void {
    // Registrar dependencias
    this.dependencies.set('IDatabaseConnection', new DatabaseConnection());
    this.dependencies.set('IBookValidator', new BookValidator());
    
    // BookRepository necesita IDatabaseConnection
    const dbConnection = this.dependencies.get('IDatabaseConnection');
    this.dependencies.set('IBookRepository', new BookRepository(dbConnection));
    
    // BookService necesita IBookRepository e IBookValidator
    const bookRepository = this.dependencies.get('IBookRepository');
    const bookValidator = this.dependencies.get('IBookValidator');
    this.dependencies.set('IBookService', new BookService(bookRepository, bookValidator));
  }

  public resolve<T>(key: string): T {
    const dependency = this.dependencies.get(key);
    if (!dependency) {
      throw new Error(`Dependency ${key} not found`);
    }
    return dependency;
  }
}