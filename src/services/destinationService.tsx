import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/destinations';
const TOKEN = localStorage.getItem('token');

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Authorization: `Bearer ${TOKEN}`,
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

// Map region: BE → FE
const mapRegionFromBE = (region: string): 'Bắc' | 'Trung' | 'Nam' => {
    switch (region) {
        case 'BAC': return 'Bắc';
        case 'TRUNG': return 'Trung';
        case 'NAM': return 'Nam';
        default: return 'Bắc';
    }
};

// Map region: FE → BE
const mapRegionToBE = (region: string): 'BAC' | 'TRUNG' | 'NAM' => {
    switch (region) {
        case 'Bắc': return 'BAC';
        case 'Trung': return 'TRUNG';
        case 'Nam': return 'NAM';
        default: return 'BAC';
    }
};

// 1. Lấy tất cả điểm đến
export const fetchDestinations = async (): Promise<Destination[]> => {
    try {
        const { data } = await axiosInstance.get('');
        return data.data.map((d: any) => ({
            ...d,
            region: mapRegionFromBE(d.region),
            imageUrl: d.imageUrl || '',
            toursCount: d.toursCount || 0,
        }));
    } catch (error) {
        throw new Error('Lỗi khi lấy danh sách điểm đến');
    }
};

// 2. Lấy điểm đến theo ID
export const fetchDestinationById = async (id: string): Promise<Destination> => {
    try {
        const { data } = await axiosInstance.get(`/${id}`);
        const dest = data.data;
        return {
            ...dest,
            region: mapRegionFromBE(dest.region),
            imageUrl: dest.imageUrl || '',
            toursCount: dest.toursCount || 0,
        };
    } catch (error) {
        throw new Error('Lỗi khi lấy thông tin điểm đến');
    }
};

// 3. Tìm kiếm điểm đến theo tên
export const searchDestinations = async (name: string): Promise<Destination[]> => {
    try {
        const { data } = await axiosInstance.get('/search', { params: { name } });
        return data.data.map((d: any) => ({
            ...d,
            region: mapRegionFromBE(d.region),
            imageUrl: d.imageUrl || '',
            toursCount: d.toursCount || 0,
        }));
    } catch (error) {
        throw new Error('Lỗi khi tìm kiếm điểm đến');
    }
};

// 4. Lọc điểm đến theo vùng
export const filterDestinationsByRegion = async (region: string): Promise<Destination[]> => {
    try {
        const { data } = await axiosInstance.get('/region', {
            params: { region: mapRegionToBE(region) },
        });
        return data.data.map((d: any) => ({
            ...d,
            region: mapRegionFromBE(d.region),
            imageUrl: d.imageUrl || '',
            toursCount: d.toursCount || 0,
        }));
    } catch (error) {
        throw new Error('Lỗi khi lọc điểm đến theo vùng');
    }
};

// 5. Tạo / Cập nhật điểm đến
export const saveDestination = async (
    destination: Omit<Destination, 'id' | 'toursCount'> & {
        imageFile?: File;
        imagePreview?: string;
    },
    id?: string
): Promise<Destination> => {
    const formData = new FormData();
    const dto = {
        name: destination.name,
        description: destination.description,
        imageUrl: destination.imageUrl || '',
        status: destination.status || 'ACTIVE',
        region: mapRegionToBE(destination.region),
    };

    formData.append('destination', JSON.stringify(dto));
    if (destination.imageFile) {
        formData.append('image', destination.imageFile);
    }

    try {
        const { data } = id
            ? await axiosInstance.put(`/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            : await axiosInstance.post('', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

        const saved = data.data;
        return {
            ...saved,
            region: mapRegionFromBE(saved.region),
            imageUrl: saved.imageUrl || '',
            toursCount: saved.toursCount || 0,
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Lỗi khi lưu điểm đến');
    }
};

// 6. Xóa điểm đến
export const deleteDestination = async (id: string): Promise<void> => {
    try {
        await axiosInstance.delete(`/${id}`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Lỗi khi xóa điểm đến');
    }
};