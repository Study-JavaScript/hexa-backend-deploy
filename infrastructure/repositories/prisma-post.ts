import { PrismaClientConfig } from "../connectors/prisma-db";
import { Post } from "../../domain/entities/post"
import { PostData, PostRepository, PostUpdateData } from "../../application/repositories/post";

export class PrismaPostRepository extends PrismaClientConfig implements PostRepository {

    async create({title, content, authorName}: PostData, userId: number): Promise<Post> {
        return await this.prisma.post.create({
            data: {
                title: title,
                content: content,
                author: {
                    connect: { id: userId } 
                },
                authorName: authorName
            }
        });
    }

    async readAll(): Promise<Post[]> {
        return await this.prisma.post.findMany({include: {likes: true}});
    }
    async readById(id: number): Promise<Post|null> {
        return await this.prisma.post.findUnique({
            where: { id },
            include: {likes: true}
        });
    }

    async delete(id: number): Promise<Post> {
        return await this.prisma.post.delete({
            where: { id },
        });
    }

    async update(id: number, post: PostUpdateData): Promise<Post> {
        return await this.prisma.post.update({
            where: { id },
            data: post,
        });
    }
}