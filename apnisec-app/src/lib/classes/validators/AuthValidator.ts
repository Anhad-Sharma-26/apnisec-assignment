import { ILoginInput, IRegisterInput } from '../../types';
import { BaseValidator } from './BaseValidator';
import * as PasswordUtil from '../utils/PasswordUtil';

export class AuthValidator extends BaseValidator {
  
  static validateLogin(data: any): ILoginInput {
    if (!data.email || !this.isEmail(data.email)) {
      this.throwValidationError('Valid email is required');
    }

    if (!data.password || !this.isString(data.password)) {
      this.throwValidationError('Password is required');
    }

    return {
      email: data.email.toLowerCase().trim(),
      password: data.password,
    };
  }

  
  static validateRegister(data: any): IRegisterInput {
    if (!data.email || !this.isEmail(data.email)) {
      this.throwValidationError('Valid email is required');
    }

    if (!data.password || !this.isString(data.password)) {
      this.throwValidationError('Password is required');
    }

    
    const passwordValidation = PasswordUtil.PasswordUtil.validateStrength(data.password);
    if (!passwordValidation.isValid) {
      this.throwValidationError(passwordValidation.message!);
    }

    return {
      email: data.email.toLowerCase().trim(),
      password: data.password,
      name: data.name ? data.name.trim() : undefined,
    };
  }
}