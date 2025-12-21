import { IssueRepository } from '../repositories/IssueRepository';
import { IssueValidator } from '../validators/IssueValidator';
import { IIssue, IssueType } from '../../types';
import { EmailUtil } from '../utils/EmailUtil';

export class IssueService {
  private issueRepository: IssueRepository;

  constructor() {
    this.issueRepository = new IssueRepository();
  }

  async getIssues(userId: string, type?: string): Promise<IIssue[]> {
    const validatedType = IssueValidator.validateTypeFilter(type);
    return await this.issueRepository.findByUserId(userId, validatedType);
  }

  async getIssueById(id: string, userId: string): Promise<IIssue> {
    const issue = await this.issueRepository.findById(id);
    
    if (!issue) {
      throw new Error('Issue not found');
    }

    if (issue.userId !== userId) {
      throw new Error('You do not have permission to view this issue');
    }

    return issue;
  }

  async createIssue(data: any, userId: string): Promise<IIssue> {
  const validatedData = IssueValidator.validateCreate(data, userId);
  const issue = await this.issueRepository.create(validatedData);


  const userRepo = new (await import('../repositories/UserRepository')).UserRepository();
  const user = await userRepo.findById(userId);
  
  if (user) {
    EmailUtil.sendIssueCreatedEmail(user.email, {
      type: issue.type,
      title: issue.title,
      description: issue.description,
    }).catch(err => console.error('Failed to send issue notification:', err));
  }

  return issue;
}

  async updateIssue(id: string, userId: string, data: any): Promise<IIssue> {
    const validatedData = IssueValidator.validateUpdate(data);
    return await this.issueRepository.update(id, userId, validatedData);
  }

  async deleteIssue(id: string, userId: string): Promise<void> {
    await this.issueRepository.delete(id, userId);
  }
}