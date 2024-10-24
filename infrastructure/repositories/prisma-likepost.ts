import { PrismaClientConfig } from "../connectors/prisma-db";
import { LikePost } from "../../domain/entities/likepost";
import { LikePostRepository } from "../../application/repositories/likepost";

export class PrismaLikePostRepository extends PrismaClientConfig implements LikePostRepository {
    async create(postId: number, userId: number): Promise<LikePost> {
        return await this.prisma.likePost.create({
            data: {
                post: {
                    connect: { id: postId }
                },
                user: {
                    connect: { id: userId }
                }
            }
        });
    }
}