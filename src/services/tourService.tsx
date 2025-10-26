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
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    bookingsCount: number;
    reviewsCount: number;
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

export const fetchDestinations = async (): Promise<Destination[]> => {
    try {
        const response = await axios.get('http://localhost:8080/api/destinations');
        return response.data.destinations.map((dest: any) => ({
            id: dest.id,
            name: dest.name,
        }));
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể tải danh sách điểm đến');
    }
};

export const fetchTours = async (
    page: number,
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
        const formattedTours = response.data.tours.map((tour: any) => ({
            ...tour,
            status: tour.status.toUpperCase() as 'ACTIVE' | 'INACTIVE',
        }));
        return {
            tours: formattedTours,
            totalPages: response.data.totalPages || 1,
            totalItems: response.data.totalItems || 0,
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể tải danh sách tour');
    }
};

// Hàm mới cho trang khách hàng, chỉ lấy tour ACTIVE
export const fetchTours2 = async (
    page: number,
    searchTerm?: string,
    destinationName?: string,
    minPrice?: string,
    maxPrice?: string
): Promise<TourResponse> => {
    try {
        const params = new URLSearchParams({ page: page.toString() });
        if (searchTerm) params.append('name', searchTerm);
        if (destinationName && destinationName !== 'all') params.append('destinationName', destinationName);
        params.append('status', 'ACTIVE'); // Cố định status là ACTIVE
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);

        const endpoint = searchTerm ? '/api/tours/search' : '/api/tours/filter';
        const response = await axios.get(`http://localhost:8080${endpoint}`, { params });
        const formattedTours = response.data.tours.map((tour: any) => ({
            ...tour,
            status: tour.status.toUpperCase() as 'ACTIVE',
        }));
        return {
            tours: formattedTours,
            totalPages: response.data.totalPages || 1,
            totalItems: response.data.totalItems || 0,
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể tải danh sách tour');
    }
};

export const addTour = async (token: string, tourData: FormData): Promise<Tour> => {
    try {
        const response = await axios.post('http://localhost:8080/api/tours', tourData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return {
            ...response.data.tour,
            status: response.data.tour.status.toUpperCase() as 'ACTIVE' | 'INACTIVE',
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể thêm tour');
    }
};

export const updateTour = async (token: string, id: number, tourData: FormData): Promise<Tour> => {
    try {
        const response = await axios.put(`http://localhost:8080/api/tours/${id}`, tourData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return {
            ...response.data.tour,
            status: response.data.tour.status.toUpperCase() as 'ACTIVE' | 'INACTIVE',
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể cập nhật tour');
    }
};

export const deleteTour = async (token: string, id: number): Promise<void> => {
    try {
        await axios.delete(`http://localhost:8080/api/tours/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể xóa tour');
    }
};

export const fetchToursByDestination = async (destinationId: string): Promise<TourResponse> => {
    try {
        const response = await axios.get(`http://localhost:8080/api/tours/destination/${destinationId}`);
        const formattedTours = response.data.tours.map((tour: any) => ({
            ...tour,
            status: tour.status.toUpperCase() as 'ACTIVE',
        }));
        return {
            tours: formattedTours,
            totalPages: 1, // API không hỗ trợ phân trang cho endpoint này, giả định 1 trang
            totalItems: formattedTours.length,
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể tải danh sách tour theo điểm đến');
    }
};