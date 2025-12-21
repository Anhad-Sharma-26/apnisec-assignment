import { PrismaClient } from '@prisma/client';
import { prisma } from '../../config/database';

export abstract class BaseRepository {
  protected db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  // Helper method for transaction support
  protected async executeInTransaction<T>(
    callback: (tx: PrismaClient) => Promise<T>
  ): Promise<T> {
    return await this.db.$transaction(async (tx) => {
      return await callback(tx as PrismaClient);
    });
  }
}