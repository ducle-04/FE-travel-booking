import axios from 'axios';

export interface Tour {
    id: number;
    name: string;
    imageUrl: string;
    destinationName: string;
    duration: string;
    price: number;
    description: string;
    averageRating: number;
    totalParticipants: number;
    maxParticipants: number;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    bookingsCount: number;
    reviewsCount: number;
    tourDetail?: TourDetail;
}

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

export interface Destination {
    id: number;
    name: string;
}

export interface TourResponse {
    tours: Tour[];
    totalPages: number;
    totalItems: number;
}

// === HELPER: CHUYỂN PAGE<T> TỪ BACKEND → TOUR RESPONSE ===
const mapPageToResponse = (page: any): TourResponse => {
    const content = page.content || [];
    const tours = content.map((tour: any) => ({
        ...tour,
        status: tour.status.toUpperCase() as 'ACTIVE' | 'INACTIVE',
        maxParticipants: tour.maxParticipants || 50,
    }));

    return {
        tours,
        totalPages: page.totalPages || 1,
        totalItems: page.totalElements || 0,
    };
};

// === 1. LẤY DANH SÁCH ĐIỂM ĐẾN (CHỈ ACTIVE) ===
export const fetchDestinations = async (): Promise<Destination[]> => {
    try {
        const response = await axios.get('http://localhost:8080/api/destinations');
        return response.data.data
            .filter((dest: any) => dest.status === 'ACTIVE')
            .map((dest: any) => ({
                id: dest.id,
                name: dest.name,
            }));
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể tải danh sách điểm đến');
    }
};

// === 2. TÌM KIẾM + LỌC TOUR (ADMIN/STAFF) ===
export const fetchTours = async (
    page: number = 0,
    searchTerm?: string,
    destinationName?: string,
    status?: string,
    minPrice?: string,
    maxPrice?: string
): Promise<TourResponse> => {
    try {
        const params = new URLSearchParams({ page: page.toString() });
        if (searchTerm) params.append('name', searchTerm);
        if (destinationName && destinationName !== 'all') params.append('destinationName', destinationName);
        if (status && status !== 'all') params.append('status', status);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);

        const endpoint = searchTerm ? '/api/tours/search' : '/api/tours/filter';
        const response = await axios.get(`http://localhost:8080${endpoint}`, { params });

        // SỬA: response.data.data là Page<TourDTO>
        return mapPageToResponse(response.data.data);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể tải danh sách tour');
    }
};

// === 3. LẤY TOUR CHO KHÁCH (CHỈ ACTIVE) ===
export const fetchTours2 = async (
    page: number = 0,
    searchTerm?: string,
    destinationName?: string,
    minPrice?: string,
    maxPrice?: string
): Promise<TourResponse> => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            status: 'ACTIVE'
        });
        if (searchTerm) params.append('name', searchTerm);
        if (destinationName && destinationName !== 'all') params.append('destinationName', destinationName);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);

        const endpoint = searchTerm ? '/api/tours/search' : '/api/tours/filter';
        const response = await axios.get(`http://localhost:8080${endpoint}`, { params });

        return mapPageToResponse(response.data.data);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể tải danh sách tour');
    }
};

// === 4. LẤY TOUR THEO ĐIỂM ĐẾN ===
export const fetchToursByDestination = async (destinationId: string): Promise<TourResponse> => {
    try {
        const response = await axios.get(`http://localhost:8080/api/tours/destination/${destinationId}`);
        const tours = (response.data.data || []).map((tour: any) => ({
            ...tour,
            status: tour.status.toUpperCase() as 'ACTIVE' | 'INACTIVE',
            maxParticipants: tour.maxParticipants || 50,
        }));
        return {
            tours,
            totalPages: 1,
            totalItems: tours.length,
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể tải danh sách tour theo điểm đến');
    }
};

// === 5. THÊM TOUR (ADMIN/STAFF) ===
export const addTour = async (token: string, tourData: FormData): Promise<Tour> => {
    try {
        const response = await axios.post('http://localhost:8080/api/tours', tourData, {
            headers: {
                Authorization: `Bearer ${token}`,
                // ĐÚNG: Không set Content-Type → axios tự thêm boundary
            },
        });
        const tour = response.data.data;
        return {
            ...tour,
            status: tour.status.toUpperCase() as 'ACTIVE' | 'INACTIVE',
            maxParticipants: tour.maxParticipants || 50,
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể thêm tour');
    }
};

// === 6. CẬP NHẬT TOUR (ADMIN/STAFF) ===
export const updateTour = async (token: string, id: number, tourData: FormData): Promise<Tour> => {
    try {
        const response = await axios.put(`http://localhost:8080/api/tours/${id}`, tourData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const tour = response.data.data;
        return {
            ...tour,
            status: tour.status.toUpperCase() as 'ACTIVE' | 'INACTIVE',
            maxParticipants: tour.maxParticipants || 50,
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể cập nhật tour');
    }
};

// === 7. XÓA TOUR (ADMIN/STAFF) ===
export const deleteTour = async (token: string, id: number): Promise<void> => {
    try {
        await axios.delete(`http://localhost:8080/api/tours/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể xóa tour');
    }
};