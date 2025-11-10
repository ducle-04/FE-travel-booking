import axios from 'axios';

export interface User {
    id: number;
    username: string;
    email: string;
    fullname: string;
    phoneNumber: string;
    status: 'Hoạt động' | 'Không hoạt động' | 'Bị cấm' | 'Đã xóa';
    role: string;
    createdAt: string;
    avatarUrl?: string;
}

interface ProfileData {
    username: string;
    fullname: string;
    email: string;
    phoneNumber: string;
    avatarUrl?: string;
}

interface UpdateProfileData {
    username: string;
    fullname: string;
    phoneNumber: string;
    password?: string;
}

const mapStatus = (status: string): User['status'] => {
    switch (status) {
        case 'ACTIVE': return 'Hoạt động';
        case 'INACTIVE': return 'Không hoạt động';
        case 'BANNED': return 'Bị cấm';
        case 'DELETED': return 'Đã xóa';
        default: return 'Hoạt động';
    }
};

const mapStatusToBackend = (status: string): string => {
    switch (status) {
        case 'Hoạt động': return 'ACTIVE';
        case 'Không hoạt động': return 'INACTIVE';
        case 'Bị cấm': return 'BANNED';
        case 'Đã xóa': return 'DELETED';
        default: return 'ACTIVE';
    }
};

// 1. Lấy profile
export const fetchUserProfile = async (token: string): Promise<ProfileData> => {
    try {
        const { data } = await axios.get('http://localhost:8080/api/user/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return {
            username: data.username,
            fullname: data.fullname,
            email: data.email,
            phoneNumber: data.phoneNumber,
            avatarUrl: data.avatarUrl || undefined,
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Lỗi kết nối server. Vui lòng kiểm tra mạng hoặc thử lại sau.');
    }
};

// 2. Cập nhật profile (chỉ thông tin text)
export const updateUserProfile = async (
    token: string,
    data: UpdateProfileData
): Promise<ProfileData> => {
    try {
        const { data: responseData } = await axios.put(
            'http://localhost:8080/api/user/profile',
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return {
            username: responseData.username,
            fullname: responseData.fullname,
            email: responseData.email,
            phoneNumber: responseData.phoneNumber,
            avatarUrl: responseData.avatarUrl || undefined,
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Cập nhật thất bại.');
    }
};

// 3. Upload avatar mới
export const uploadAvatar = async (token: string, file: File): Promise<string> => {
    if (file.size > 5 * 1024 * 1024) {
        throw new Error('Kích thước ảnh không được vượt quá 5MB');
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
        const { data } = await axios.put(
            'http://localhost:8080/api/user/avatar',
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return data.avatarUrl;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Upload ảnh thất bại.');
    }
};

// 4. Xóa avatar
export const deleteAvatar = async (token: string): Promise<void> => {
    try {
        await axios.delete('http://localhost:8080/api/user/avatar', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Xóa ảnh thất bại.');
    }
};

// 5. Lấy danh sách user
export const fetchUsers = async (token: string, role?: string): Promise<User[]> => {
    try {
        const url = `http://localhost:8080/api/user/list${role ? `?role=${role}` : ''}`;
        const { data } = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return data.map((user: any) => ({
            id: user.id,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
            phoneNumber: user.phoneNumber,
            status: mapStatus(user.status),
            role: user.roles?.[0] || 'USER',
            createdAt: new Date(user.createdAt).toLocaleDateString('vi-VN'),
            avatarUrl: user.avatarUrl || undefined,
        }));
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể lấy danh sách tài khoản.');
    }
};

// 6. Lấy chi tiết user
export const fetchUserDetails = async (token: string, username: string): Promise<User> => {
    try {
        const { data } = await axios.get(`http://localhost:8080/api/user/${username}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return {
            id: data.id,
            username: data.username,
            email: data.email,
            fullname: data.fullname,
            phoneNumber: data.phoneNumber,
            status: mapStatus(data.status),
            role: data.roles?.[0] || 'USER',
            createdAt: new Date(data.createdAt).toLocaleDateString('vi-VN'),
            avatarUrl: data.avatarUrl || undefined,
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể lấy thông tin chi tiết tài khoản.');
    }
};

// 7. Tạo user
export const createUser = async (token: string, userData: any): Promise<User> => {
    try {
        const { data } = await axios.post(
            'http://localhost:8080/api/user/create',
            {
                ...userData,
                status: mapStatusToBackend(userData.status),
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return {
            id: data.id,
            username: data.username,
            email: data.email,
            fullname: data.fullname,
            phoneNumber: data.phoneNumber,
            status: mapStatus(data.status),
            role: data.roles?.[0] || 'USER',
            createdAt: new Date(data.createdAt).toLocaleDateString('vi-VN'),
            avatarUrl: data.avatarUrl || undefined,
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể tạo tài khoản.');
    }
};

// 8. Cập nhật user (Staff)
export const updateUser = async (token: string, username: string, userData: any): Promise<User> => {
    try {
        const { data } = await axios.put(
            `http://localhost:8080/api/user/staff/update/${username}`,
            {
                username: userData.username,
                fullname: userData.fullname,
                phoneNumber: userData.phoneNumber,
                status: mapStatusToBackend(userData.status),
                roles: [userData.role],
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return {
            id: data.id,
            username: data.username,
            email: data.email,
            fullname: data.fullname,
            phoneNumber: data.phoneNumber,
            status: mapStatus(data.status),
            role: data.roles?.[0] || userData.role,
            createdAt: new Date(data.createdAt).toLocaleDateString('vi-VN'),
            avatarUrl: data.avatarUrl || undefined,
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể cập nhật tài khoản.');
    }
};

// 9. Xóa user
export const deleteUser = async (token: string, id: number): Promise<void> => {
    try {
        await axios.delete(`http://localhost:8080/api/user/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể xóa tài khoản.');
    }
};

// 10. Cập nhật trạng thái
export const updateUserStatus = async (token: string, username: string, status: string): Promise<User> => {
    try {
        const { data } = await axios.put(
            `http://localhost:8080/api/user/status/${username}?status=${mapStatusToBackend(status)}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return {
            id: data.id,
            username: data.username,
            email: data.email,
            fullname: data.fullname,
            phoneNumber: data.phoneNumber,
            status: mapStatus(data.status),
            role: data.roles?.[0] || 'USER',
            createdAt: new Date(data.createdAt).toLocaleDateString('vi-VN'),
            avatarUrl: data.avatarUrl || undefined,
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể cập nhật trạng thái.');
    }
};