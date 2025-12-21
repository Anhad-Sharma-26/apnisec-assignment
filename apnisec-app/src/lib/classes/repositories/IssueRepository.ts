import { BaseRepository } from "./BaseRepository";
import { IIssue, IIssueCreateInput, IIssueUpdateInput } from "../../types";
import { NotFoundError } from "../errors/AppError";

export class IssueRepository extends BaseRepository {
  async findByUserId(userId: string, type?: string): Promise<IIssue[]> {
    const where: any = { userId };
    
    if (type) {
      where.type = type;
    }

    return await this.db.issue.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findById(id: string): Promise<IIssue | null> {
    return await this.db.issue.findUnique({
      where: { id }
    });
  }

  async create(data: IIssueCreateInput): Promise<IIssue> {
    return await this.db.issue.create({
      data
    });
  }

  async update(id: string, userId: string, data: IIssueUpdateInput): Promise<IIssue> {
    const issue = await this.db.issue.findFirst({
      where: { id, userId }
    });

    if (!issue) {
      throw new NotFoundError('Issue not found or you do not have permission to update it');
    }

    return await this.db.issue.update({
      where: { id },
      data
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    const issue = await this.db.issue.findFirst({
      where: { id, userId }
    });

    if (!issue) {
      throw new NotFoundError('Issue not found or you do not have permission to delete it');
    }

    await this.db.issue.delete({
      where: { id }
    });
  }
}