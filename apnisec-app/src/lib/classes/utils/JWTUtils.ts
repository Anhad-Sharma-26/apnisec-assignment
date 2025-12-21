import jwt from 'jsonwebtoken';
import { IJWTPayload, IAuthTokens } from '../../types';
import { UnauthorizedError } from '../errors/AppError';

export class JWTUtil {
  private static get ACCESS_TOKEN_SECRET(): string {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }
    return process.env.JWT_SECRET;
  }

  private static get REFRESH_TOKEN_SECRET(): string {
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error('JWT_REFRESH_SECRET is not configured');
    }
    return process.env.JWT_REFRESH_SECRET;
  }

  private static readonly ACCESS_TOKEN_EXPIRY = '1d'; // 1 day
  private static readonly REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

  /**
   * Generate access and refresh tokens
   */
  static generateTokens(payload: IJWTPayload): IAuthTokens {
    const accessToken = jwt.sign(payload, this.ACCESS_TOKEN_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign(payload, this.REFRESH_TOKEN_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Generate only access token
   */
  static generateAccessToken(payload: IJWTPayload): string {
    return jwt.sign(payload, this.ACCESS_TOKEN_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    });
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): IJWTPayload {
    try {
      const decoded = jwt.verify(token, this.ACCESS_TOKEN_SECRET) as IJWTPayload;
      return decoded;
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): IJWTPayload {
    try {
      const decoded = jwt.verify(token, this.REFRESH_TOKEN_SECRET) as IJWTPayload;
      return decoded;
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string | null): string {
    if (!authHeader) {
      throw new UnauthorizedError('No authorization header provided');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedError('Invalid authorization header format');
    }

    return parts[1];
  }
}