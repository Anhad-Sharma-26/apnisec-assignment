import { IIssueCreateInput, IIssueUpdateInput, IssueType, IssuePriority, IssueStatus } from '../../types';
import { BaseValidator } from './BaseValidator';

export class IssueValidator extends BaseValidator {
  private static readonly VALID_TYPES: IssueType[] = ['cloud-security', 'reteam-assessment', 'vapt'];
  private static readonly VALID_PRIORITIES: IssuePriority[] = ['low', 'medium', 'high'];
  private static readonly VALID_STATUSES: IssueStatus[] = ['open', 'in-progress', 'closed'];

  static validateCreate(data: any, userId: string): IIssueCreateInput {
    if (!data.type || !this.VALID_TYPES.includes(data.type)) {
      this.throwValidationError('Valid issue type is required (cloud-security, reteam-assessment, vapt)');
    }

    if (!data.title || !this.isString(data.title)) {
      this.throwValidationError('Title is required');
    }

    if (!data.description || !this.isString(data.description)) {
      this.throwValidationError('Description is required');
    }

    if (data.priority && !this.VALID_PRIORITIES.includes(data.priority)) {
      this.throwValidationError('Invalid priority (low, medium, high)');
    }

    if (data.status && !this.VALID_STATUSES.includes(data.status)) {
      this.throwValidationError('Invalid status (open, in-progress, closed)');
    }

    return {
      type: data.type,
      title: data.title.trim(),
      description: data.description.trim(),
      priority: data.priority || 'medium',
      status: data.status || 'open',
      userId,
    };
  }

  static validateUpdate(data: any): IIssueUpdateInput {
    const updates: IIssueUpdateInput = {};

    if (data.type) {
      if (!this.VALID_TYPES.includes(data.type)) {
        this.throwValidationError('Invalid issue type');
      }
      updates.type = data.type;
    }

    if (data.title) {
      if (!this.isString(data.title)) {
        this.throwValidationError('Invalid title');
      }
      updates.title = data.title.trim();
    }

    if (data.description) {
      if (!this.isString(data.description)) {
        this.throwValidationError('Invalid description');
      }
      updates.description = data.description.trim();
    }

    if (data.priority) {
      if (!this.VALID_PRIORITIES.includes(data.priority)) {
        this.throwValidationError('Invalid priority');
      }
      updates.priority = data.priority;
    }

    if (data.status) {
      if (!this.VALID_STATUSES.includes(data.status)) {
        this.throwValidationError('Invalid status');
      }
      updates.status = data.status;
    }

    return updates;
  }

  static validateTypeFilter(type?: string): IssueType | undefined {
    if (!type) return undefined;
    
    if (!this.VALID_TYPES.includes(type as IssueType)) {
      this.throwValidationError('Invalid issue type filter');
    }
    
    return type as IssueType;
  }
}