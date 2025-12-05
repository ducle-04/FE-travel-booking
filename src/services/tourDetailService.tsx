import axios from 'axios';
import type { Tour } from './tourService';

export interface TransportDTO {
    name: string;
    price: number;
}

export interface HotelDTO {
    id: number;
    name: string;
    description: string;
    address: string;
    starRating: string;
    images: string[];
    videos: string[];
}

export interface TourDetail {
    itinerary: string;
    departurePoint: string;
    departureTime: string;
    suitableFor: string;
    cancellationPolicy: string;
    transports: TransportDTO[];
    selectedHotels: HotelDTO[]; // ← Quan trọng: FE nhận full hotel info
    additionalImages: string[];
    videos: string[];
}

export interface StartDateAvailability {
    date: string;
    formattedDate: string;
    remainingSeats: number;
    available: boolean;
}

// GET: Lấy tour + chi tiết (BE trả tourDetail nếu có)
export const fetchTourDetail = async (tourId: string): Promise<Tour & { tourDetail: TourDetail | null }> => {
    try {
        const response = await axios.get(`http://localhost:8080/api/tours/${tourId}`);
        return response.data.data; // BE trả đúng kiểu có tourDetail
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể tải chi tiết tour');
    }
};

// POST: Cập nhật chi tiết tour - ĐÚNG THEO BE
export const updateTourDetail = async (
    token: string,
    tourId: string,
    detailData: {
        itinerary: string;
        departurePoint: string;
        departureTime: string;
        suitableFor: string;
        cancellationPolicy: string;
        transports: TransportDTO[];
        selectedHotelIds: number[];
    },
    additionalImages: File[] = [],
    videos: File[] = []
): Promise<TourDetail> => {
    const form = new FormData();

    // Các field text
    form.append('itinerary', detailData.itinerary);
    form.append('departurePoint', detailData.departurePoint);
    form.append('departureTime', detailData.departureTime);
    form.append('suitableFor', detailData.suitableFor);
    form.append('cancellationPolicy', detailData.cancellationPolicy);

    // transports → JSON string (BE yêu cầu)
    form.append('transports', JSON.stringify(detailData.transports));

    // selectedHotelIds → JSON string [1,2,3]
    form.append('selectedHotelIds', JSON.stringify(detailData.selectedHotelIds));

    // Files
    additionalImages.forEach(file => form.append('additionalImages', file));
    videos.forEach(file => form.append('videos', file));

    const response = await axios.post(
        `http://localhost:8080/api/tours/${tourId}/details`,
        form,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        }
    );

    return response.data.data; // ← Trả về TourDetailDTO đã được enhance với full hotel info
};

// Xóa ảnh/video
export const deleteAdditionalImage = async (token: string, tourId: string, imageUrl: string): Promise<void> => {
    await axios.delete(`http://localhost:8080/api/tours/${tourId}/details/images`, {
        params: { imageUrl },
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const deleteVideo = async (token: string, tourId: string, videoUrl: string): Promise<void> => {
    await axios.delete(`http://localhost:8080/api/tours/${tourId}/details/videos`, {
        params: { videoUrl },
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const fetchStartDateAvailability = async (tourId: string): Promise<StartDateAvailability[]> => {
    try {
        const response = await axios.get(`http://localhost:8080/api/tours/${tourId}/start-dates`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Không thể tải ngày khởi hành");
    }
};

