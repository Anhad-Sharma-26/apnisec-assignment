import { NextRequest } from 'next/server';
import { AuthService } from '../../../../lib/classes/services/AuthServices';
import { ResponseUtil } from '../../../../lib/classes/utils/ResponseUtil';
import { AppError } from '../../../../lib/classes/errors/AppError';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const authService = new AuthService();
    const result = await authService.login(body);

    return ResponseUtil.success(result, 'Login successful');
  } catch (error) {
    if (error instanceof AppError) {
      return ResponseUtil.error(error.message, error.statusCode);
    }
    
    console.error('Login error:', error);
    return ResponseUtil.error('Internal server error', 500);
  }
}