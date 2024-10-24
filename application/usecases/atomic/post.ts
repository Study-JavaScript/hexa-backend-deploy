import { PostData, PostRepository, PostUpdateData } from "../../../application/repositories/post";
import { Post } from "../../../domain/entities/post";

// ⚠️🖊️ Se ha de manejar correctamente el uso de post.deleted ya que los test nos lo requiere y solo seria necesario en el update
// 🧠❓ Tambien hemos de pensar que hacer con los update, ya que es buena practica comprobar que x existe antes de hacer update, por lo tanto quizas nos interesa devolver ese x para segun que cuestiones del backend o frontend

abstract class UseCaseBase {
    constructor(protected postRepository: PostRepository) {}
}

export class CreatePost extends UseCaseBase {
    async execute(postData: PostData, userId: number): Promise<Post> {
        return this.postRepository.create(postData, userId);
    }
}

export class ReadAllPosts extends UseCaseBase {
    async execute(): Promise<Post[]> {
        return this.postRepository.readAll();
    }
}
export class ReadById extends UseCaseBase {
    async execute(id: number): Promise<Post|null> {
        return this.postRepository.readById(id);
    }
}

export class UpdatePost extends UseCaseBase {
    async execute(id: number, postData: PostUpdateData): Promise<Post> {
        const updatedPost = await this.postRepository.update(id, postData);
        if (!updatedPost) {
            throw new Error('Post not found'); // Manejo del error
        }
        return updatedPost;
    }
}


export class DeletePost extends UseCaseBase {
    async execute(id: number): Promise<void> {
        await this.postRepository.delete(id);
    }
}
