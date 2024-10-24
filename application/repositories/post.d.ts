import { Post } from "../../domain/entities/post";

export type PostData = Omit<Post, 'id' | 'likes' | 'deleted' | 'authorId' | 'date' >
export type PostUpdateData = Partial<Omit<Post, 'id' | 'likes'>>
export type PostRepository = {
    create(postData: PostData, userId: number): Promise<Post>;
    readAll(): Promise<Post[]>;
    readById(id: number): Promise<Post|null>;
    delete(id: number): Promise<Post>;
    update(id: number, postData: PostUpdateData): Promise<Post>;

}