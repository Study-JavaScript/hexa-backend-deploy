import { UserRepository } from "../../repositories/user";
import { User } from "../../../domain/entities/User";
import { ReadAll } from "../../usecases/atomic/user";

// Mock del repositorio
const mockUserRepository = (): jest.Mocked<UserRepository> => ({
  create: jest.fn(),
  readById: jest.fn(),
  readByEmail: jest.fn(),
  readAll: jest.fn(),
  update: jest.fn(),
});

describe('ReadAll UseCase', () => {
  it('should return all users', async () => {
    const userRepository = mockUserRepository();

    const mockUsers: User[] = [
      { id: 1, email: 'user1@example.com', password: 'password1', name: 'User One', role: 'USER', banned: false },
      { id: 2, email: 'user2@example.com', password: 'password2', name: 'User Two', role: 'USER', banned: false },
    ];
    userRepository.readAll.mockResolvedValue(mockUsers);

    const readAll = new ReadAll(userRepository);
    const result = await readAll.execute();

    expect(userRepository.readAll).toHaveBeenCalled();
    expect(result).toEqual(mockUsers);
  });
});
