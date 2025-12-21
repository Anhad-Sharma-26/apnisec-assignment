import { UserRepository } from '../repositories/UserRepository';
import { PasswordUtil } from '../utils/PasswordUtil';
import { JWTUtil } from '../utils/JWTUtils';
import { AuthValidator } from '../validators/AuthValidator';
import { ILoginInput, IRegisterInput, IAuthTokens, IUserResponse } from '../../types';
import { UnauthorizedError } from '../errors/AppError';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: any): Promise<{ user: IUserResponse; tokens: IAuthTokens }> {
    const validatedData = AuthValidator.validateRegister(data);

    const hashedPassword = await PasswordUtil.hash(validatedData.password);

    const user = await this.userRepository.create({
      email: validatedData.email,
      password: hashedPassword,
      name: validatedData.name,
    });

    const tokens = JWTUtil.generateTokens({
      userId: user.id,
      email: user.email,
    });

    return {
      user: this.userRepository.toResponse(user),
      tokens,
    };
  }


  async login(data: any): Promise<{ user: IUserResponse; tokens: IAuthTokens }> {
    const validatedData = AuthValidator.validateLogin(data);

    const user = await this.userRepository.findByEmail(validatedData.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await PasswordUtil.compare(validatedData.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const tokens = JWTUtil.generateTokens({
      userId: user.id,
      email: user.email,
    });

    return {
      user: this.userRepository.toResponse(user),
      tokens,
    };
  }

  async getCurrentUser(userId: string): Promise<IUserResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return this.userRepository.toResponse(user);
  }

  async verifyToken(token: string): Promise<IUserResponse> {
    const payload = JWTUtil.verifyAccessToken(token);
    return await this.getCurrentUser(payload.userId);
  }
}