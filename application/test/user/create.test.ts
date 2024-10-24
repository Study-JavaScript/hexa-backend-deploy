import { User } from "../../../domain/entities/user";
import { UserRepository } from "../../repositories/user";
import { CreateUser } from "../../usecases/atomic/user";

// Mock del repositorio
const mockUserRepository = (): jest.Mocked<UserRepository> => ({
  create: jest.fn(),
  readById: jest.fn(),
  readByEmail: jest.fn(),
  readAll: jest.fn(),
  update: jest.fn(),
});

describe('CreateUser UseCase', () => {
  it('should create a new user and return it', async () => {
    const userRepository = mockUserRepository();

    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: 'USER',
      banned: false
    };
    userRepository.create.mockResolvedValue(mockUser);

    const createUser = new CreateUser(userRepository);

    const userData = { email: 'test@example.com', name: 'Test User', password: 'password123' };
    const result = await createUser.execute(userData);

    expect(userRepository.create).toHaveBeenCalledWith(userData);
    expect(result).toEqual(mockUser);
  });
});
