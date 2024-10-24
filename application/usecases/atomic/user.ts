import { UserRepository } from "../../../application/repositories/user";
import { User } from "../../../domain/entities/user";
import { FindDbError } from "../../../domain/errors/main";


abstract class UseCaseBase {
    constructor(protected userRepository: UserRepository){}
}
export class CreateUser extends UseCaseBase {
    async execute(userData: {email:string, name?: string, password:string}): Promise<User> {
        return this.userRepository.create(userData);
    }
}
export class ReadById extends UseCaseBase {
    async execute(id: number): Promise<User | null> {
        return this.userRepository.readById(id);
    }
}
export class ReadByEmail extends UseCaseBase {
    async execute(email: string): Promise<User | null> {
        return this.userRepository.readByEmail(email);
    }
}
export class ReadAll extends UseCaseBase {
    async execute(): Promise<User[]> {
        return this.userRepository.readAll()
    }
}
export class UpdateUser extends UseCaseBase {
    async execute(id: number, userData: Partial<User>): Promise<User> {
        const existingUser = await this.userRepository.readById(id);
        if (!existingUser) {
            throw new FindDbError('User not found in usecase'); // Manejo del error
        }
        return this.userRepository.update(id, userData);
    }
}
