export class BookValidator {
  public static validateBook(data: any): string[] {
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

  public static validateBookUpdate(data: any): string[] {
    const errors: string[] = [];

    if (data.title && (typeof data.title !== "string" || data.title.length < 3)) {
      errors.push("title must be a string with at least 3 characters");
    }

    if (data.description && (typeof data.description !== "string" || data.description.length < 10)) {
      errors.push("description must be a string with at least 10 characters");
    }

    if (data.author && (typeof data.author !== "string" || !/^[a-zA-Z\s]+$/.test(data.author))) {
      errors.push("author must contain only letters and spaces");
    }

    return errors;
  }

  public static hasErrors(errors: string[]): boolean {
    return errors.length > 0;
  }
}