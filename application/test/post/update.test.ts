// test/post/UpdatePost.test.ts
import { Post } from "../../../domain/entities/post";
import { PostRepository } from "../../repositories/post";
import { UpdatePost } from "../../usecases/atomic/post";

// Mock del repositorio
const mockPostRepository = (): jest.Mocked<PostRepository> => ({
  create: jest.fn(),
  readAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  readById: jest.fn(),
});

describe('UpdatePost UseCase', () => {
  it('should update an existing post and return it', async () => {
    const postRepository = mockPostRepository();

    const existingPost: Post = { id: 1, title: 'Old Post', content: 'Old Content', deleted: false, authorId: 1 , date: new Date(), authorName: 'Author Name'};
    const updatedPost: Post = { id: 1, title: 'Updated Post', content: 'Updated Content', deleted: false, authorId: 1 , date: new Date(), authorName: 'Author Name'};

    postRepository.update.mockResolvedValue(updatedPost); // Simulamos una actualización exitosa

    const updatePost = new UpdatePost(postRepository);
    const postData = { title: 'Updated Post', content: 'Updated Content' };
    const result = await updatePost.execute(1, postData);

    expect(postRepository.update).toHaveBeenCalledWith(1, postData);
    expect(result).toEqual(updatedPost);
  });

  it('should throw an error if the post does not exist', async () => {
    const postRepository = mockPostRepository();
    postRepository.update.mockRejectedValue(new Error('Post not found')); // Cambiado aquí

    const updatePost = new UpdatePost(postRepository);
    const postData = { title: 'Nonexistent Post', content: 'Content' };

    await expect(updatePost.execute(999, postData)).rejects.toThrow('Post not found');
  });
});
