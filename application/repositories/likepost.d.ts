import { LikePost } from "domain/entities/likepost"

export type LikePostRepository = {
    create: (postId: number, userId: number) => Promise<LikePost>
}