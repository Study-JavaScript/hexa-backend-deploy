import { LikePost } from "./likepost"

export type Post = {
    id: number,
    title: string,
    content: string | null,
    deleted: boolean,
    authorId: number,
    date: Date,
    authorName: string,
    likes?: LikePost[]
}