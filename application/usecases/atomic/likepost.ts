import { LikePost } from "../../../domain/entities/likepost";
import { LikePostRepository } from "../../repositories/likepost";

abstract class UseCaseBase {
    constructor(protected likePostRepository: LikePostRepository){}
}
export class CreateLikePost extends UseCaseBase {
    async execute(postId: number, userId: number): Promise<LikePost> {
        return await this.likePostRepository.create(postId, userId);
    }
}