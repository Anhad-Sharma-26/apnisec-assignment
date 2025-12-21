import { ValidationError } from '../errors/AppError';

export abstract class BaseValidator {
  protected static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  protected static isString(value: any): boolean {
    return typeof value === 'string' && value.trim().length > 0;
  }

  protected static throwValidationError(message: string): never {
    throw new ValidationError(message);
  }
}