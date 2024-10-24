import { PostsPopularity } from '../../usecases/comp/post';
import { PostRepository } from '../../repositories/post';
import { UserRepository } from '../../repositories/user';
import { Post } from '../../../domain/entities/post';
import { User } from '../../../domain/entities/user'; // Asumimos que existe una entidad User

describe('PostsPopularity', () => {
  let postsPopularity: PostsPopularity;
  let mockPostRepository: jest.Mocked<PostRepository>;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockPostRepository = {
      readAll: jest.fn(),
    } as any;
    mockUserRepository = {
      readAll: jest.fn(),
    } as any;
    postsPopularity = new PostsPopularity(mockPostRepository, mockUserRepository);
  });

  it('debe calcular correctamente la popularidad de los posts', async () => {
    const mockPosts: Post[] = [
      {
        id: 1,
        title: 'Post 1',
        content: 'Contenido 1',
        deleted: false,
        authorId: 1,
        date: new Date(),
        authorName: 'Autor 1',
        likes: [{id: 2, userId: 2, postId: 1, createdAt: new Date()}, {id: 3, userId: 3, postId: 1, createdAt: new Date()}],
      },
      {
        id: 2,
        title: 'Post 2',
        content: 'Contenido 2',
        deleted: false,
        authorId: 2,
        date: new Date(),
        authorName: 'Autor 2',
        likes: [{id: 1, userId: 1, postId: 2, createdAt: new Date()}],
      },
    ];

    const mockUsers: User[] = [
      { id: 1, name: 'Usuario 1', email: 'usuario1@example.com', password: 'password', role: 'user', banned: false   },
      { id: 2, name: 'Usuario 2', email: 'usuario2@example.com', password: 'password', role: 'user', banned: false },
      { id: 3, name: 'Usuario 3', email: 'usuario3@example.com', password: 'password', role: 'user', banned: false },
    ];

    mockPostRepository.readAll.mockResolvedValue(mockPosts);
    mockUserRepository.readAll.mockResolvedValue(mockUsers);

    const result = await postsPopularity.execute();

    expect(result).toEqual([
      { id: 1, popularity: 1 }, // 2 likes / (3 usuarios totales - 1) = 1
      { id: 2, popularity: 0.5 }, // 1 like / (3 usuarios totales - 1) = 0.5
    ]);

    expect(mockPostRepository.readAll).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.readAll).toHaveBeenCalledTimes(1);
  });

  it('debe manejar posts sin likes', async () => {
    const mockPosts: Post[] = [
      {
        id: 1,
        title: 'Post sin likes',
        content: 'Contenido',
        deleted: false,
        authorId: 1,
        date: new Date(),
        authorName: 'Autor 1',
      },
    ];

    const mockUsers: User[] = [
      { id: 1, name: 'Usuario 1', email: 'usuario1@example.com', password: 'password', role: 'user', banned: false },
    { id: 2, name: 'Usuario 2', email: 'usuario2@example.com', password: 'password', role: 'user', banned: false },
    ];

    mockPostRepository.readAll.mockResolvedValue(mockPosts);
    mockUserRepository.readAll.mockResolvedValue(mockUsers);

    const result = await postsPopularity.execute();

    expect(result).toEqual([
      { id: 1, popularity: 0 },
    ]);
  });
});
