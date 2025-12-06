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
    categoryId?: number;
    categoryName?: string;
    categoryIcon?: string;
    startDates?: string[];
    views?: number;
}

export interface Destination {
    id: number;
    name: string;
}

export interface TourCategory {
    id: number;
    name: string;
    icon: string;
}

export interface TourResponse {
    tours: Tour[];
    totalPages: number;
    totalItems: number;
}

export interface TourStatsData {
    totalTours: number;
    activeTours: number;
    inactiveTours: number;
    totalConfirmedBookings: number;
}

const mapPageToResponse = (page: any): TourResponse => {
    const content = page.content || [];
    const tours = content.map((tour: any) => ({
        ...tour,
        status: (tour.status || 'ACTIVE').toUpperCase() as 'ACTIVE' | 'INACTIVE',
        maxParticipants: tour.maxParticipants || 50,
        categoryId: tour.categoryId ?? undefined,
        categoryName: tour.categoryName ?? undefined,
        categoryIcon: tour.categoryIcon ?? 'MapPin',
        startDates: tour.startDates || [],
        views: tour.views ?? 0, // Đảm bảo luôn có views (mặc định 0 nếu backend chưa trả)
    }));

    return {
        tours,
        totalPages: page.totalPages || 1,
        totalItems: page.totalElements || 0,
    };
};

export const fetchDestinations = async (): Promise<Destination[]> => {
    try {
        const response = await axios.get('http://localhost:8080/api/destinations');
        return response.data.data
            .filter((dest: any) => dest.status === 'ACTIVE')
            .map((dest: any) => ({ id: dest.id, name: dest.name }));
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể tải điểm đến');
    }
};

export const fetchTourCategories = async (): Promise<TourCategory[]> => {
    try {
        const response = await axios.get('http://localhost:8080/api/tour-categories/active');
        return response.data.data.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            icon: cat.icon || 'MapPin',
        }));
    } catch (error) {
        console.warn('Dùng dữ liệu mẫu loại tour');
        return [
            { id: 1, name: 'Biển đảo', icon: 'Waves' },
            { id: 2, name: 'Núi rừng', icon: 'Trees' },
            { id: 3, name: 'Văn hóa - Lịch sử', icon: 'Landmark' },
            { id: 4, name: 'Ẩm thực', icon: 'Utensils' },
            { id: 5, name: 'MICE & Teambuilding', icon: 'Briefcase' },
        ];
    }
};

export const fetchTours = async (
    page: number = 0,
    searchTerm?: string,
    destinationName?: string,
    status?: string,
    minPrice?: string,
    maxPrice?: string,
    categoryId?: string
): Promise<TourResponse> => {
    const params = new URLSearchParams({ page: page.toString() });
    if (searchTerm) params.append('name', searchTerm);
    if (destinationName && destinationName !== 'all') params.append('destinationName', destinationName);
    if (status && status !== 'all') params.append('status', status);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (categoryId && categoryId !== 'all') params.append('categoryId', categoryId);

    const endpoint = searchTerm ? '/api/tours/search' : '/api/tours/filter';
    const response = await axios.get(`http://localhost:8080${endpoint}`, { params });
    return mapPageToResponse(response.data.data);
};

export const fetchToursForCustomer = async (
    page: number = 0,
    searchTerm?: string,
    destinationName?: string,
    minPrice?: string,
    maxPrice?: string,
    categoryId?: string
): Promise<TourResponse> => {
    return fetchTours(page, searchTerm, destinationName, 'ACTIVE', minPrice, maxPrice, categoryId);
};

export const addTour = async (token: string, tourData: FormData): Promise<Tour> => {
    const response = await axios.post('http://localhost:8080/api/tours', tourData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.data;
};

export const updateTour = async (token: string, id: number, tourData: FormData): Promise<Tour> => {
    const response = await axios.put(`http://localhost:8080/api/tours/${id}`, tourData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.data;
};

export const deleteTour = async (token: string, id: number): Promise<void> => {
    await axios.delete(`http://localhost:8080/api/tours/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const fetchToursByDestination = async (destinationId: string): Promise<TourResponse> => {
    try {
        const response = await axios.get(`http://localhost:8080/api/tours/destination/${destinationId}`);
        const tours = (response.data.data || []).map((tour: any) => ({
            ...tour,
            status: (tour.status || 'ACTIVE').toUpperCase() as 'ACTIVE' | 'INACTIVE',
            maxParticipants: tour.maxParticipants || 50,
            categoryId: tour.category?.id || tour.categoryId,
            categoryName: tour.category?.name || tour.categoryName,
            categoryIcon: tour.category?.icon || 'MapPin',
            startDates: tour.startDates || [],
            views: tour.views ?? 0,
        }));
        return {
            tours,
            totalPages: 1,
            totalItems: tours.length
        };
    } catch (error: any) {
        console.error('Lỗi tải tour theo điểm đến:', error);
        throw new Error(error.response?.data?.message || 'Không thể tải tour theo điểm đến');
    }
};

export const fetchTourStats = async (): Promise<TourStatsData> => {
    try {
        const response = await axios.get('http://localhost:8080/api/tours/stats');
        const data = response.data.data;

        return {
            totalTours: data.totalTours || 0,
            activeTours: data.activeTours || 0,
            inactiveTours: data.inactiveTours || 0,
            totalConfirmedBookings: data.totalConfirmedBookings || 0,
        };
    } catch (error: any) {
        console.error('Lỗi khi tải thống kê tour:', error);
        throw new Error(error.response?.data?.message || 'Không thể tải thống kê tour');
    }
};