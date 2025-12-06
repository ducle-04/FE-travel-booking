// services/reviewService.ts
import { axiosInstance } from './bookingService';  // ← LẤY SẴN TỪ BOOKING SERVICE

export interface ReviewCreateRequest {
    rating: number;
    comment?: string;
}

export interface ReviewDTO {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    userFullname: string;
    userAvatarUrl?: string;
}

export const createReview = async (tourId: number, data: ReviewCreateRequest): Promise<ReviewDTO> => {
    const response = await axiosInstance.post(`/reviews/tour/${tourId}`, data);
    return response.data.data;
};

export const canReviewTour = async (tourId: number): Promise<boolean> => {
    const response = await axiosInstance.get(`/reviews/tour/${tourId}/can-review`);
    return response.data.data;
};

export const fetchReviewsByTour = async (tourId: number, page = 0, size = 10): Promise<{
    content: ReviewDTO[];
    totalElements: number;
    totalPages: number;
}> => {
    const response = await axiosInstance.get(`/reviews/tour/${tourId}`, { params: { page, size } });
    return response.data.data;
};