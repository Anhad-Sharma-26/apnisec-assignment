import { User, Issue } from '@prisma/client';

// ============================================
// User Types
// ============================================
export interface IUser extends User {}

export interface IUserCreateInput {
  email: string;
  password: string;
  name?: string;
}

export interface IUserUpdateInput {
  name?: string;
  email?: string;
}

export interface IUserResponse {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
}

// ============================================
// Issue Types
// ============================================
export interface IIssue extends Issue {}

export type IssueType = 'cloud-security' | 'reteam-assessment' | 'vapt';
export type IssuePriority = 'low' | 'medium' | 'high';
export type IssueStatus = 'open' | 'in-progress' | 'closed';

export interface IIssueCreateInput {
  type: IssueType;
  title: string;
  description: string;
  priority?: IssuePriority;
  status?: IssueStatus;
  userId: string;
}

export interface IIssueUpdateInput {
  type?: IssueType;
  title?: string;
  description?: string;
  priority?: IssuePriority;
  status?: IssueStatus;
}

// ============================================
// Auth Types
// ============================================
export interface IAuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IRegisterInput {
  email: string;
  password: string;
  name?: string;
}

export interface IJWTPayload {
  userId: string;
  email: string;
}

// ============================================
// API Response Types
// ============================================
export interface IApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface IPaginationParams {
  page?: number;
  limit?: number;
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// Rate Limiting Types
// ============================================
export interface IRateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export interface IRateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}