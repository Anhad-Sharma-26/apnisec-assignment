import { NextRequest } from 'next/server';
import { IssueService } from '../../../../lib/classes/services/IssueService';
import { ResponseUtil } from '../../../../lib/classes/utils/ResponseUtil';
import { AppError } from '../../../../lib/classes/errors/AppError';
import { getAuthUser } from '../../../../lib/middleware/auth';
import { applyRateLimit } from '../../../../lib/middleware/rateLimit';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    applyRateLimit(request);
    const { userId } = getAuthUser(request);
    
    const issueService = new IssueService();
    const issue = await issueService.getIssueById(params.id, userId);

    return ResponseUtil.success(issue, 'Issue retrieved successfully');
  } catch (error) {
    if (error instanceof AppError) {
      return ResponseUtil.error(error.message, error.statusCode);
    }
    
    console.error('Get issue error:', error);
    return ResponseUtil.error('Internal server error', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    applyRateLimit(request);
    const { userId } = getAuthUser(request);
    const body = await request.json();
    
    const issueService = new IssueService();
    const issue = await issueService.updateIssue(params.id, userId, body);

    return ResponseUtil.success(issue, 'Issue updated successfully');
  } catch (error) {
    if (error instanceof AppError) {
      return ResponseUtil.error(error.message, error.statusCode);
    }
    
    console.error('Update issue error:', error);
    return ResponseUtil.error('Internal server error', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    applyRateLimit(request);
    const { userId } = getAuthUser(request);
    
    const issueService = new IssueService();
    await issueService.deleteIssue(params.id, userId);

    return ResponseUtil.noContent();
  } catch (error) {
    if (error instanceof AppError) {
      return ResponseUtil.error(error.message, error.statusCode);
    }
    
    console.error('Delete issue error:', error);
    return ResponseUtil.error('Internal server error', 500);
  }
}