import { NextRequest } from 'next/server';
import { JWTUtil } from '../classes/utils/JWTUtils';
import { UnauthorizedError } from '../classes/errors/AppError';

export function getAuthUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = JWTUtil.extractTokenFromHeader(authHeader);
    const payload = JWTUtil.verifyAccessToken(token);
    return payload;
  } catch (error) {
    throw new UnauthorizedError('Authentication required');
  }
}