import { NextRequest } from 'next/server';
import { ResponseUtil } from '../../../../lib/classes/utils/ResponseUtil';
import { AppError } from '../../../../lib/classes/errors/AppError';
import { getAuthUser } from '../../../../lib/middleware/auth';

export async function POST(request: NextRequest) {
  try {
    getAuthUser(request);
    
    return ResponseUtil.success({ message: 'Logged out successfully' });
  } catch (error) {
    if (error instanceof AppError) {
      return ResponseUtil.error(error.message, error.statusCode);
    }
    
    console.error('Logout error:', error);
    return ResponseUtil.error('Internal server error', 500);
  }
}