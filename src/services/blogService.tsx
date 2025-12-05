// src/services/blogService.ts
import axios from "axios";
import { axiosInstance } from "./bookingService";
import type { BlogDTO, BlogCommentDTO, BlogCreateDTO } from "../types/blogTypes";

// ─────────────────────────────────────────────────────────────
// 1. Axios riêng cho API public (KHÔNG TOKEN, KHÔNG INTERCEPTOR)
// ─────────────────────────────────────────────────────────────
const publicApi = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: { "Content-Type": "application/json" },
});

// ─────────────────────────────────────────────────────────────
// 2. PUBLIC BLOG APIs (Không cần đăng nhập)
// ─────────────────────────────────────────────────────────────

// Lấy danh sách blog đã duyệt
export const fetchPublishedBlogs = async (page = 0, size = 10) => {
    const res = await publicApi.get("/blogs", {
        params: { page, size },
    });
    return res.data.data;
};

// Lấy 1 blog (tự động tăng view)
export const fetchBlogById = async (id: number): Promise<BlogDTO> => {
    const res = await publicApi.get(`/blogs/${id}`);
    return res.data.data;
};

// Lấy bài viết liên quan
export const fetchRelatedBlogs = async (id: number) => {
    const res = await publicApi.get(`/blogs/${id}/related`);
    return res.data.data;
};

// Lấy bình luận đã duyệt
export const fetchBlogComments = async (id: number) => {
    const res = await publicApi.get(`/blogs/${id}/comments`);
    return res.data.data;
};

// ─────────────────────────────────────────────────────────────
// 3. BLOG APIs yêu cầu TOKEN (viết blog, gửi comment)
// ─────────────────────────────────────────────────────────────

// Đăng blog mới
export const createBlog = async (
    dto: BlogCreateDTO,
    thumbnailFile: File,
    imageFiles: File[] = []
) => {
    const formData = new FormData();

    formData.append("blog", new Blob([JSON.stringify(dto)], { type: "application/json" }));
    formData.append("thumbnail", thumbnailFile);

    imageFiles.forEach((file) => formData.append("images", file));

    const res = await axiosInstance.post("/blogs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.data as BlogDTO;
};

// Gửi bình luận
export const createComment = async (blogId: number, content: string) => {
    const res = await axiosInstance.post(`/blogs/${blogId}/comments`, { content });
    return res.data.data as BlogCommentDTO;
};
