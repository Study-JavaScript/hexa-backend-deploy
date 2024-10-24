// test/post/ReadAllPosts.test.ts
import { Post } from "../../../domain/entities/post";
import { PostRepository } from "../../repositories/post";
import { ReadAllPosts } from "../../usecases/atomic/post";

// Mock del repositorio
const mockPostRepository = (): jest.Mocked<PostRepository> => ({
  create: jest.fn(),
  readAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  readById: jest.fn(),
});

describe('ReadAllPosts UseCase', () => {
  it('should return all posts', async () => {
    const postRepository = mockPostRepository();

    const mockPosts: Post[] = [
      { id: 1, title: 'Post 1', content: 'Content 1', deleted: false, authorId: 1 , date: new Date(), authorName: 'Author Name'},
      { id: 2, title: 'Post 2', content: 'Content 2', deleted: false, authorId: 1 , date: new Date(), authorName: 'Author Name'},
    ];
    postRepository.readAll.mockResolvedValue(mockPosts);

    const readAllPosts = new ReadAllPosts(postRepository);
    const result = await readAllPosts.execute();

    expect(postRepository.readAll).toHaveBeenCalled();
    expect(result).toEqual(mockPosts);
  });
});
