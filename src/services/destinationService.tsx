import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/destinations';
const TOKEN = localStorage.getItem('token');

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Authorization': `Bearer ${TOKEN}`,
    },
});

interface Destination {
    id: string;
    name: string;
    region: 'Bắc' | 'Trung' | 'Nam';
    description: string;
    imageUrl: string;
    toursCount: number;
    status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
}

// Hàm ánh xạ region từ BE sang FE
const mapRegionFromBE = (region: string): 'Bắc' | 'Trung' | 'Nam' => {
    switch (region) {
        case 'BAC': return 'Bắc';
        case 'TRUNG': return 'Trung';
        case 'NAM': return 'Nam';
        default: return 'Bắc';
    }
};

// Hàm ánh xạ region từ FE sang BE
const mapRegionToBE = (region: string): 'BAC' | 'TRUNG' | 'NAM' => {
    switch (region) {
        case 'Bắc': return 'BAC';
        case 'Trung': return 'TRUNG';
        case 'Nam': return 'NAM';
        default: return 'BAC';
    }
};

// Lấy danh sách điểm đến
export const fetchDestinations = async (): Promise<Destination[]> => {
    try {
        const response = await axiosInstance.get('');
        return response.data.destinations.map((dest: any) => ({
            ...dest,
            region: mapRegionFromBE(dest.region),
            imageUrl: dest.imageUrl || '',
            toursCount: dest.toursCount || 0,
        }));
    } catch (error) {
        throw new Error('Lỗi khi lấy danh sách điểm đến');
    }
};

// Tìm kiếm điểm đến theo tên
export const searchDestinations = async (term: string): Promise<Destination[]> => {
    try {
        const response = await axiosInstance.get(`/search?name=${encodeURIComponent(term)}`);
        return response.data.destinations.map((dest: any) => ({
            ...dest,
            region: mapRegionFromBE(dest.region),
            imageUrl: dest.imageUrl || '',
            toursCount: dest.toursCount || 0,
        }));
    } catch (error) {
        throw new Error('Lỗi khi tìm kiếm điểm đến');
    }
};

// Lọc điểm đến theo khu vực
export const filterDestinationsByRegion = async (region: string): Promise<Destination[]> => {
    try {
        const response = await axiosInstance.get(`/region?region=${mapRegionToBE(region)}`);
        return response.data.destinations.map((dest: any) => ({
            ...dest,
            region: mapRegionFromBE(dest.region),
            imageUrl: dest.imageUrl || '',
            toursCount: dest.toursCount || 0,
        }));
    } catch (error) {
        throw new Error('Lỗi khi lọc điểm đến theo khu vực');
    }
};

// Tạo mới hoặc cập nhật điểm đến
export const saveDestination = async (
    destination: Omit<Destination, 'id'> & { imageFile?: File; imagePreview?: string },
    id?: string
): Promise<Destination> => {
    const formDataToSend = new FormData();
    const destinationDTO = {
        name: destination.name,
        region: mapRegionToBE(destination.region),
        description: destination.description,
        imageUrl: destination.imageUrl || '',
        status: destination.status || 'ACTIVE',
        toursCount: destination.toursCount || 0,
    };
    formDataToSend.append('destination', JSON.stringify(destinationDTO));
    if (destination.imageFile) {
        formDataToSend.append('image', destination.imageFile);
    }

    try {
        if (id) {
            // Cập nhật điểm đến
            const response = await axiosInstance.put(`/${id}`, formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return {
                ...response.data.destination,
                region: mapRegionFromBE(response.data.destination.region),
                imageUrl: response.data.destination.imageUrl || '',
                toursCount: response.data.destination.toursCount || 0,
            };
        } else {
            // Tạo mới điểm đến
            const response = await axiosInstance.post('', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return {
                ...response.data.destination,
                region: mapRegionFromBE(response.data.destination.region),
                imageUrl: response.data.destination.imageUrl || '',
                toursCount: response.data.destination.toursCount || 0,
            };
        }
    } catch (error: any) {
        throw new Error(error.response?.data || 'Lỗi khi lưu điểm đến');
    }
};

// Xóa điểm đến
export const deleteDestination = async (id: string): Promise<void> => {
    try {
        await axiosInstance.delete(`/${id}`);
    } catch (error: any) {
        throw new Error(error.response?.data || 'Lỗi khi xóa điểm đến');
    }
};