import { IUserUpdateInput } from '../../types';
import { BaseValidator } from './BaseValidator';

export class UserValidator extends BaseValidator {

  static validateProfileUpdate(data: any): IUserUpdateInput {
    const updates: IUserUpdateInput = {};

    if (data.name !== undefined) {
      if (data.name && !this.isString(data.name)) {
        this.throwValidationError('Invalid name');
      }
      updates.name = data.name ? data.name.trim() : undefined;
    }

    if (data.email) {
      if (!this.isEmail(data.email)) {
        this.throwValidationError('Valid email is required');
      }
      updates.email = data.email.toLowerCase().trim();
    }

    return updates;
  }
}