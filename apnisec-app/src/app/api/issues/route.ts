import { NextRequest } from 'next/server';
import { IssueService } from '../../../lib/classes/services/IssueService';
import { ResponseUtil } from '../../../lib/classes/utils/ResponseUtil';
import { AppError } from '../../../lib/classes/errors/AppError';
import { getAuthUser } from '../../../lib/middleware/auth';
import { applyRateLimit } from '../../../lib/middleware/rateLimit';

export async function GET(request: NextRequest) {
  try {
    applyRateLimit(request);
    const { userId } = getAuthUser(request);
    
    // Get type filter from query params
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;
    
    const issueService = new IssueService();
    const issues = await issueService.getIssues(userId, type);

    return ResponseUtil.success(issues, 'Issues retrieved successfully');
  } catch (error) {
    if (error instanceof AppError) {
      return ResponseUtil.error(error.message, error.statusCode);
    }
    
    console.error('Get issues error:', error);
    return ResponseUtil.error('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    applyRateLimit(request);
    const { userId } = getAuthUser(request);
    const body = await request.json();
    
    const issueService = new IssueService();
    const issue = await issueService.createIssue(body, userId);

    return ResponseUtil.created(issue, 'Issue created successfully');
  } catch (error) {
    if (error instanceof AppError) {
      return ResponseUtil.error(error.message, error.statusCode);
    }
    
    console.error('Create issue error:', error);
    return ResponseUtil.error('Internal server error', 500);
  }
}