import axios from 'axios';
import type { Tour } from './tourService';

export interface TourDetail {
    transportation: string;
    itinerary: string;
    departurePoint: string;
    departureTime: string;
    suitableFor: string;
    cancellationPolicy: string;
    additionalImages: string[];
    videos: string[];
}

// GET: Lấy tour + chi tiết (phải có tourDetail trong response)
export const fetchTourDetail = async (tourId: string): Promise<Tour> => {
    try {
        const response = await axios.get(`http://localhost:8080/api/tours/${tourId}`);
        const tour = response.data.data;

        return {
            ...tour,
            status: tour.status.toUpperCase() as 'ACTIVE' | 'INACTIVE',
            maxParticipants: tour.maxParticipants || 50,
            tourDetail: tour.tourDetail || {
                transportation: '',
                itinerary: '',
                departurePoint: '',
                departureTime: '',
                suitableFor: '',
                cancellationPolicy: '',
                additionalImages: [],
                videos: []
            }
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể tải chi tiết tour');
    }
};

// POST: Cập nhật chi tiết tour
export const updateTourDetail = async (
    token: string,
    tourId: string,
    detailData: Partial<TourDetail>,
    additionalImages: File[] = [],
    videos: File[] = []
): Promise<TourDetail> => {
    const form = new FormData();

    Object.entries(detailData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            form.append(key, value.toString());
        }
    });

    additionalImages.forEach(file => form.append('additionalImages', file));
    videos.forEach(file => form.append('videos', file));

    try {
        const response = await axios.post(
            `http://localhost:8080/api/tours/${tourId}/details`,
            form,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Cập nhật chi tiết tour thất bại');
    }
};

// DELETE: Xóa ảnh
export const deleteAdditionalImage = async (token: string, tourId: string, imageUrl: string): Promise<void> => {
    await axios.delete(`http://localhost:8080/api/tours/${tourId}/details/images`, {
        params: { imageUrl },
        headers: { Authorization: `Bearer ${token}` }
    });
};

// DELETE: Xóa video
export const deleteVideo = async (token: string, tourId: string, videoUrl: string): Promise<void> => {
    await axios.delete(`http://localhost:8080/api/tours/${tourId}/details/videos`, {
        params: { videoUrl },
        headers: { Authorization: `Bearer ${token}` }
    });
};