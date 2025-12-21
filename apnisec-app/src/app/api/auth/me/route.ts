import { NextRequest } from 'next/server';
import { AuthService } from '../../../../lib/classes/services/AuthServices';
import { ResponseUtil } from '../../../../lib/classes/utils/ResponseUtil';
import { AppError } from '../../../../lib/classes/errors/AppError';
import { getAuthUser } from '../../../../lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuthUser(request);
    
    const authService = new AuthService();
    const user = await authService.getCurrentUser(userId);

    return ResponseUtil.success(user, 'User retrieved successfully');
  } catch (error) {
    if (error instanceof AppError) {
      return ResponseUtil.error(error.message, error.statusCode);
    }
    
    console.error('Get user error:', error);
    return ResponseUtil.error('Internal server error', 500);
  }
}