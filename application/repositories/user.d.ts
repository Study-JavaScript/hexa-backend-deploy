import { User } from '../entities/User';

export type UserRepository = {
  create(userData: {email:string, name?: string, password:string}): Promise<User>;
  readById(id: number): Promise<User | null>;
  readByEmail(email: string): Promise<User | null>;
  readAll(): Promise<User[]>
  update(id: number, userData: Partial<User>): Promise<User>;
}