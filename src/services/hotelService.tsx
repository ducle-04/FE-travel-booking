import axios from 'axios';

const API_URL = 'http://localhost:8080/api/hotels';

// === CÁC TYPE CHUNG ===
interface ApiResponse<T> {
    message: string;
    data: T;
}

export interface Hotel {
    id: number;
    name: string;
    address: string;
    starRating: number;
    description?: string;
    status: 'ACTIVE' | 'INACTIVE';
    images: string[];
    videos?: string[];
}

export interface HotelStats {
    totalHotels: number;
    activeHotels: number;
    fiveStarHotels: number;
    uniqueAddresses: number;
}

interface PageResponse<T> {
    content: T[];
    page: number;         // trang hiện tại (0-based)
    size: number;
    totalElements: number;
    totalPages: number;
}

// === HELPER: lấy token ===
const getToken = () => {
    return localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken') || '';
};

// === API FUNCTIONS ===

// LẤY DANH SÁCH + LỌC + PHÂN TRANG
export const fetchHotels = async (
    page = 0,
    name?: string,
    address?: string,
    status?: 'ACTIVE' | 'INACTIVE' | 'all' | '',
    starRating?: number | ''
) => {
    const params: Record<string, any> = { page, size: 10 };

    if (name?.trim()) params.name = name.trim();
    if (address?.trim()) params.address = address.trim();

    // Chỉ gửi status nếu là ACTIVE hoặc INACTIVE
    if (status === 'ACTIVE' || status === 'INACTIVE') {
        params.status = status;
    }

    if (starRating !== '' && starRating !== undefined && starRating !== null) {
        params.starRating = Number(starRating);
    }

    const response = await axios.get<ApiResponse<PageResponse<Hotel>>>(API_URL, {
        params,
        headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {}
    });

    const pageData = response.data.data;

    return {
        hotels: pageData.content,
        currentPage: pageData.page,
        totalPages: pageData.totalPages,
        totalItems: pageData.totalElements,
        pageSize: pageData.size
    };
};

// THỐNG KÊ
export const fetchHotelStats = async (): Promise<HotelStats> => {
    const response = await axios.get<ApiResponse<HotelStats>>(`${API_URL}/stats`, {
        headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {}
    });
    return response.data.data;
};

// THÊM MỚI
export const addHotel = async (formData: FormData) => {
    await axios.post<ApiResponse<Hotel>>(API_URL, formData, {
        headers: {
            Authorization: `Bearer ${getToken()}`
            // Không set Content-Type → browser tự thêm boundary cho multipart/form-data
        }
    });
};

// CẬP NHẬT
export const updateHotel = async (id: number, formData: FormData) => {
    await axios.put<ApiResponse<Hotel>>(`${API_URL}/${id}`, formData, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
};

// XÓA
export const deleteHotel = async (id: number) => {
    await axios.delete<ApiResponse<null>>(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
};

// XÓA ẢNH RIÊNG LẺ
export const deleteHotelImage = async (hotelId: number, imageUrl: string) => {
    await axios.delete<ApiResponse<null>>(`${API_URL}/${hotelId}/images`, {
        params: { imageUrl }, // Spring sẽ nhận @RequestParam("imageUrl")
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
};

// XÓA VIDEO RIÊNG LẺ
export const deleteHotelVideo = async (hotelId: number, videoUrl: string) => {
    await axios.delete<ApiResponse<null>>(`${API_URL}/${hotelId}/videos`, {
        params: { videoUrl },
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
};