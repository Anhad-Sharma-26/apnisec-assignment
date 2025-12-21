import { UserRepository } from '../repositories/UserRepository';
import { UserValidator } from '../validators/UserValidator';
import { IUserResponse } from '../../types';
import { ConflictError } from '../errors/AppError';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getProfile(userId: string): Promise<IUserResponse> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return this.userRepository.toResponse(user);
  }

  async updateProfile(userId: string, data: any): Promise<IUserResponse> {
    const validatedData = UserValidator.validateProfileUpdate(data);

    if (validatedData.email) {
      const existingUser = await this.userRepository.findByEmail(validatedData.email);
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictError('Email already in use');
      }
    }

    const updatedUser = await this.userRepository.update(userId, validatedData);
    return this.userRepository.toResponse(updatedUser);
  }
}