import axios from 'axios';

interface ProfileData {
    username: string;
    fullname: string;
    email: string;
    phoneNumber: string;
}

interface UpdateProfileData {
    username: string;
    email: string;
    fullname: string;
    phoneNumber: string;
    password?: string;
}

export const fetchUserProfile = async (token: string): Promise<ProfileData> => {
    try {
        const response = await axios.get('http://localhost:8080/api/user/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data || 'Lỗi kết nối server. Vui lòng kiểm tra mạng hoặc thử lại sau.');
    }
};

export const updateUserProfile = async (token: string, data: UpdateProfileData): Promise<ProfileData> => {
    try {
        const response = await axios.put('http://localhost:8080/api/user/profile', data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data || 'Lỗi kết nối server. Vui lòng kiểm tra mạng hoặc thử lại sau.');
    }
};