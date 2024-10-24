// backend/src/infrastructure/repositories/PrismaUserRepository.ts

import { Prisma } from '@prisma/client';
import { PrismaClientConfig } from '../connectors/prisma-db';
import { User } from '../../domain/entities/user';
import { UserRepository } from '../../application/repositories/user';

export class PrismaUserRepository extends PrismaClientConfig implements UserRepository {
  constructor() {
    super()
  }

  async create(userData: {email:string, password:string, name?: string}): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: userData,
      });
    } catch (error) {
      this.handleError(error, 'Failed to create user');
    }
  }

  async readById(id: number): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({ where: { id } });
    } catch (error) {
      this.handleError(error, 'Failed to find user by id');
    }
  }

  async readByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({ where: { email } });
    } catch (error) {
      this.handleError(error, 'Failed to find user by email');
    }
  }
    async readAll(): Promise<User[]> {
        try {
            return await this.prisma.user.findMany({ include: { posts: true, likePosts: true  } });
        } catch (error) {
            this.handleError(error, 'Failed to find all users');
        }
    }

    async update(id: number, userData: Partial<User>): Promise<User> {
        try {
        return await this.prisma.user.update({
            where: { id },
            data: userData,
        });
        } catch (error) {
        this.handleError(error, 'Failed to update user');
        }
    }
  
//   async delete(id: number): Promise<void> {
//     try {
//       await this.prisma.user.delete({ where: { id } });
//     } catch (error) {
//       this.handleError(error, 'Failed to delete user');
//     }
//   }

  private handleError(error: unknown, message: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`${message}: ${error.message} (Code: ${error.code})`);
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      throw new Error(`${message}: ${error.message}`);
    } else if (error instanceof Error) {
      throw new Error(`${message}: ${error.message}`);
    } else {
      throw new Error(`${message}: An unknown error occurred`);
    }
  }
}