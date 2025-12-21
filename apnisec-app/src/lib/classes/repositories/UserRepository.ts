import { BaseRepository } from "./BaseRepository";
import { IUserCreateInput, IUser, IUserResponse } from "../../types";
import { NotFoundError, ConflictError } from "../errors/AppError";

export class UserRepository extends BaseRepository{
    async findByEmail(email: string): Promise<IUser | null>{
        return await this.db.user.findUnique({
            where: {
                email: email
            }
        });
    }
    async findById(id: string): Promise<IUser | null> {
        return await this.db.user.findUnique({
            where: {
                id}
            }
        );
    }
    async create(data: IUserCreateInput): Promise<IUser> {
        const existingUser = await this.findByEmail(data.email);
        if (existingUser) {
            throw new ConflictError('User already exists');
        }
        return await this.db.user.create({
            data,
        });
    }
    async update(id: string, data: Partial<IUserCreateInput>): Promise<IUser>{
        const user = await this.findById(id);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return await this.db.user.update({
            where: {
                id},
                data,});
    }
     async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await this.db.user.delete({
      where: { id },
    });
  }

  
  toResponse(user: IUser): IUserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }  
}