import axios from 'axios';

// ─────────────────────────────────────────────────────────────────────────────
// 1. Types
// ─────────────────────────────────────────────────────────────────────────────
export type BookingStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'REJECTED'
    | 'CANCEL_REQUEST'
    | 'CANCELLED'
    | 'COMPLETED'
    | 'DELETED';

export interface Booking {
    id: number;
    tourId: number;
    tourName: string;
    destinationName: string;
    selectedStartDate: string;        // ← Đổi tên cho rõ (BE trả selectedStartDate)
    numberOfPeople: number;
    totalPrice: number;
    bookingDate: string;
    status: BookingStatus;
    note?: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    guest: boolean;
    userId?: number;
    userFullname?: string;
    userPhone?: string;
    userAvatarUrl?: string;
    paymentMethod?: string;
    paymentStatus?: string;
    selectedTransportName?: string;
    selectedTransportPrice?: number;
    paidAt?: string;

}

export interface BookingPage {
    content: Booking[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Axios instance
// ─────────────────────────────────────────────────────────────────────────────
const API_BASE_URL = 'http://localhost:8080/api';

const TOKEN = () => sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

axiosInstance.interceptors.request.use(config => {
    const token = TOKEN();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axiosInstance.interceptors.response.use(
    res => res,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('jwtToken');
            sessionStorage.removeItem('jwtToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. API Response
// ─────────────────────────────────────────────────────────────────────────────
interface ApiResponse<T> {
    message: string;
    data: T;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Request DTO
// ─────────────────────────────────────────────────────────────────────────────
export interface CreateBookingRequest {
    tourId: number;
    startDate: string;
    numberOfPeople: number;

    transportName?: string;   // optional
    paymentMethod: 'DIRECT' | 'MOMO';

    contactName?: string;     // required nếu guest
    contactEmail?: string;
    contactPhone?: string;

    note?: string;
}


// ─────────────────────────────────────────────────────────────────────────────
// 5. API Functions – 
// ─────────────────────────────────────────────────────────────────────────────
export const createBooking = async (request: CreateBookingRequest): Promise<Booking> => {
    const response = await axiosInstance.post<ApiResponse<Booking>>('/bookings', request);
    return response.data.data;
};


export const requestCancelBooking = async (id: number, reason?: string): Promise<Booking> => {
    const response = await axiosInstance.post<ApiResponse<Booking>>(
        `/bookings/${id}/cancel`,
        reason || '',                                           // ← Gửi chuỗi thô
        { headers: { 'Content-Type': 'text/plain' } }           // ← Quan trọng!
    );
    return response.data.data;
};

export const fetchMyBookings = async (
    page = 0,
    status?: BookingStatus[]
): Promise<BookingPage> => {
    const params: Record<string, string> = { page: page.toString() };
    if (status && status.length > 0) {
        params.status = status.join(','); // Spring tự parse List
    }
    const response = await axiosInstance.get<ApiResponse<BookingPage>>('/bookings/my', { params });
    return response.data.data;
};

export const fetchPendingBookings = async (
    page = 0,
    status?: BookingStatus[]
): Promise<BookingPage> => {
    const params: Record<string, string> = { page: page.toString() };
    if (status && status.length > 0) {
        params.status = status.join(',');
    }
    const response = await axiosInstance.get<ApiResponse<BookingPage>>('/bookings/pending', { params });
    return response.data.data;
};

export const confirmBooking = async (id: number): Promise<Booking> => {
    const response = await axiosInstance.patch<ApiResponse<Booking>>(`/bookings/${id}/confirm`);
    return response.data.data;
};

export const rejectBooking = async (id: number, reason?: string): Promise<Booking> => {
    const response = await axiosInstance.patch<ApiResponse<Booking>>(
        `/bookings/${id}/reject`,
        reason || '',
        { headers: { 'Content-Type': 'text/plain' } }
    );
    return response.data.data;
};

export const approveCancellation = async (id: number): Promise<Booking> => {
    const response = await axiosInstance.patch<ApiResponse<Booking>>(`/bookings/${id}/cancel/approve`);
    return response.data.data;
};

export const rejectCancellation = async (id: number, reason?: string): Promise<Booking> => {
    const response = await axiosInstance.patch<ApiResponse<Booking>>(
        `/bookings/${id}/cancel/reject`,
        reason || '',
        { headers: { 'Content-Type': 'text/plain' } }
    );
    return response.data.data;
};

export const completeBooking = async (id: number): Promise<Booking> => {
    const response = await axiosInstance.patch<ApiResponse<Booking>>(`/bookings/${id}/complete`);
    return response.data.data;
};

export const softDeleteBooking = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/bookings/${id}`);
};

// Thêm vào bookingService.ts
export const updatePaymentStatus = async (
    bookingId: number,
    status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED'
): Promise<Booking> => {
    const response = await axiosInstance.patch<ApiResponse<Booking>>(
        `/payments/${bookingId}/status?status=${status}`
    );
    return response.data.data;
};

export { axiosInstance };