import { PostRepository } from "../../repositories/post";
import { UserRepository } from "../../repositories/user";

abstract class UserUseCaseBase {
    constructor(protected postRepository: PostRepository, protected userRepository: UserRepository) {}
}
export class PostsPopularity extends UserUseCaseBase {
    async execute(): Promise<{id: number, popularity: number}[]> {
        const posts = await this.postRepository.readAll();
        const users = await this.userRepository.readAll();
        return posts.map((post) => {
            const likes = post.likes?.length || 0;
            const totalUsers = users.length;
            const popularity = likes / (totalUsers-1)
            if(popularity >= 0) return { id: post.id, popularity };
            return { id: post.id, popularity: 0 };
        });
    }
}
