import { User } from "../../../domain/entities/user";
import { UserRepository } from "../../repositories/user";
import { ReadById } from "../../usecases/atomic/user";

// Mock del repositorio
const mockUserRepository = (): jest.Mocked<UserRepository> => ({
  create: jest.fn(),
  readById: jest.fn(),
  readByEmail: jest.fn(),
  readAll: jest.fn(),
  update: jest.fn(),
});

describe('ReadById UseCase', () => {
  it('should return a user by id', async () => {
    const userRepository = mockUserRepository();

    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: 'USER',
      banned: false
    };
    userRepository.readById.mockResolvedValue(mockUser);

    const readById = new ReadById(userRepository);
    const result = await readById.execute(1);

    expect(userRepository.readById).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockUser);
  });

  it('should return null if no user is found', async () => {
    const userRepository = mockUserRepository();
    userRepository.readById.mockResolvedValue(null);

    const readById = new ReadById(userRepository);
    const result = await readById.execute(999);

    expect(userRepository.readById).toHaveBeenCalledWith(999);
    expect(result).toBeNull();
  });
});
