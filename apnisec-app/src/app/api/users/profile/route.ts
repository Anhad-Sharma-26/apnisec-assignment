import { NextRequest } from 'next/server';
import { UserService } from '../../../../lib/classes/services/UserServices';
import { ResponseUtil } from '../../../../lib/classes/utils/ResponseUtil';
import { AppError } from '../../../../lib/classes/errors/AppError';
import { getAuthUser } from '../../../../lib/middleware/auth';
import { applyRateLimit } from '../../../../lib/middleware/rateLimit';

export async function GET(request: NextRequest) {
  try {
    applyRateLimit(request);
    const { userId } = getAuthUser(request);
    
    const userService = new UserService();
    const profile = await userService.getProfile(userId);

    return ResponseUtil.success(profile, 'Profile retrieved successfully');
  } catch (error) {
    if (error instanceof AppError) {
      return ResponseUtil.error(error.message, error.statusCode);
    }
    
    console.error('Get profile error:', error);
    return ResponseUtil.error('Internal server error', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    applyRateLimit(request);
    const { userId } = getAuthUser(request);
    const body = await request.json();
    
    const userService = new UserService();
    const profile = await userService.updateProfile(userId, body);

    return ResponseUtil.success(profile, 'Profile updated successfully');
  } catch (error) {
    if (error instanceof AppError) {
      return ResponseUtil.error(error.message, error.statusCode);
    }
    
    console.error('Update profile error:', error);
    return ResponseUtil.error('Internal server error', 500);
  }
}