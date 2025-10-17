import axios from 'axios';

interface RegisterData {
    username: string;
    password: string;
    email: string;
    fullname: string;
    phoneNumber: string;
}

interface LoginData {
    username: string;
    password: string;
}

interface LoginResponse {
    token: string;
    roles?: string[];
}

export const registerUser = async (data: RegisterData): Promise<string> => {
    try {
        const response = await axios.post('http://localhost:8080/api/auth/register', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data || 'Lỗi kết nối server. Vui lòng kiểm tra mạng hoặc thử lại sau.');
    }
};

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
    try {
        const response = await axios.post('http://localhost:8080/api/auth/login', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data || 'Lỗi kết nối server. Vui lòng kiểm tra mạng hoặc thử lại sau.');
    }
};