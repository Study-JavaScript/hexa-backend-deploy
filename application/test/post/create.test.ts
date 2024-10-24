// test/post/CreatePost.test.ts
import { Post } from "../../../domain/entities/post";
import { PostRepository } from "../../repositories/post";
import { CreatePost } from "../../usecases/atomic/post";

// Mock del repositorio
const mockPostRepository = (): jest.Mocked<PostRepository> => ({
  create: jest.fn(),
  readAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  readById: jest.fn(),
});

describe('CreatePost UseCase', () => {
  it('should create a new post and return it', async () => {
    const postRepository = mockPostRepository();

    const postData = { title: 'New Post', content: 'Content of the post', authorName: 'Author Name' };
    const newPost: Post = { id: 1, title: 'New Post', content: 'Content of the post', deleted: false, authorId: 1, date: new Date(), authorName: 'Author Name' };

    postRepository.create.mockResolvedValue(newPost);

    const createPost = new CreatePost(postRepository);
    const result = await createPost.execute(postData, 1);

    expect(postRepository.create).toHaveBeenCalledWith(postData, 1);
    expect(result).toEqual(newPost);
  });
});
