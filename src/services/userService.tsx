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
}

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

const mapStatus = (status: string): User['status'] => {
    switch (status) {
        case 'ACTIVE':
            return 'Hoạt động';
        case 'INACTIVE':
            return 'Không hoạt động';
        case 'BANNED':
            return 'Bị cấm';
        case 'DELETED':
            return 'Đã xóa';
        default:
            return 'Hoạt động';
    }
};

const mapStatusToBackend = (status: string): string => {
    switch (status) {
        case 'Hoạt động':
            return 'ACTIVE';
        case 'Không hoạt động':
            return 'INACTIVE';
        case 'Bị cấm':
            return 'BANNED';
        case 'Đã xóa':
            return 'DELETED';
        default:
            return 'ACTIVE';
    }
};

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
        throw new Error(error.response?.data?.message || 'Lỗi kết nối server. Vui lòng kiểm tra mạng hoặc thử lại sau.');
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
        throw new Error(error.response?.data?.message || 'Lỗi kết nối server. Vui lòng kiểm tra mạng hoặc thử lại sau.');
    }
};

export const fetchUsers = async (token: string, role?: string): Promise<User[]> => {
    try {
        const url = 'http://localhost:8080/api/user/list' + (role ? `?role=${role}` : '');
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data.map((user: any) => ({
            id: user.id,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
            phoneNumber: user.phoneNumber,
            status: mapStatus(user.status),
            role: user.roles?.[0] || 'USER',
            createdAt: new Date(user.createdAt).toLocaleDateString('vi-VN'),
        }));
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể lấy danh sách tài khoản.');
    }
};

export const fetchUserDetails = async (token: string, username: string): Promise<User> => {
    try {
        const response = await axios.get(`http://localhost:8080/api/user/${username}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        const userData = response.data;
        return {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            fullname: userData.fullname,
            phoneNumber: userData.phoneNumber,
            status: mapStatus(userData.status),
            role: userData.roles?.[0] || 'USER',
            createdAt: new Date(userData.createdAt).toLocaleDateString('vi-VN'),
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể lấy thông tin chi tiết tài khoản.');
    }
};

export const createUser = async (token: string, userData: any): Promise<User> => {
    try {
        const response = await axios.post('http://localhost:8080/api/user/create', {
            ...userData,
            status: mapStatusToBackend(userData.status),
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        const createdUser = response.data;
        return {
            id: createdUser.id,
            username: createdUser.username,
            email: createdUser.email,
            fullname: createdUser.fullname,
            phoneNumber: createdUser.phoneNumber,
            status: mapStatus(createdUser.status),
            role: createdUser.roles?.[0] || 'USER',
            createdAt: new Date(createdUser.createdAt).toLocaleDateString('vi-VN'),
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể tạo tài khoản.');
    }
};

export const updateUser = async (token: string, username: string, userData: any): Promise<User> => {
    try {
        const response = await axios.put(`http://localhost:8080/api/user/staff/update/${username}`, {
            username: userData.username,
            email: userData.email,
            fullname: userData.fullname,
            phoneNumber: userData.phoneNumber,
            status: mapStatusToBackend(userData.status),
            roles: [userData.role],
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        const updatedUser = response.data;
        return {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            fullname: updatedUser.fullname,
            phoneNumber: updatedUser.phoneNumber,
            status: mapStatus(updatedUser.status),
            role: updatedUser.roles?.[0] || userData.role,
            createdAt: new Date(updatedUser.createdAt).toLocaleDateString('vi-VN'),
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể cập nhật tài khoản.');
    }
};

export const deleteUser = async (token: string, id: number): Promise<void> => {
    try {
        await axios.delete(`http://localhost:8080/api/user/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể xóa tài khoản.');
    }
};

export const updateUserStatus = async (token: string, username: string, status: string): Promise<User> => {
    try {
        const response = await axios.put(
            `http://localhost:8080/api/user/status/${username}?status=${mapStatusToBackend(status)}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        const updatedUser = response.data;
        return {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            fullname: updatedUser.fullname,
            phoneNumber: updatedUser.phoneNumber,
            status: mapStatus(updatedUser.status),
            role: updatedUser.roles?.[0] || 'USER',
            createdAt: new Date(updatedUser.createdAt).toLocaleDateString('vi-VN'),
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Không thể cập nhật trạng thái.');
    }
};