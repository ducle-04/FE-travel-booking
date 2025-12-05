// src/services/types/blogTypes.ts
export interface BlogSummaryDTO {
    id: number;
    title: string;
    thumbnail: string;
    shortDescription: string;
    authorName: string;
    createdAt: string;
    views: number;
    commentCount: number;
}

export interface BlogDTO {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    authorName: string;
    authorId: number;
    createdAt: string;
    updatedAt?: string;
    views: number;
    images: string[];
}

export interface BlogCommentDTO {
    id: number;
    content: string;
    createdAt: string;
    username: string;
    userAvatarUrl?: string;
}

export interface BlogCreateDTO {
    title: string;
    content: string;
}