interface RegisterFormData {
    fullName: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

interface LoginFormData {
    username: string;
    password: string;
}

export const validateRegisterForm = (formData: RegisterFormData): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
        errors.fullName = 'Họ và tên không được để trống';
    }
    if (!formData.username.trim()) {
        errors.username = 'Tên đăng nhập không được để trống';
    }
    if (!formData.email.trim()) {
        errors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Email không hợp lệ';
    }
    if (!formData.phone.trim()) {
        errors.phone = 'Số điện thoại không được để trống';
    } else if (!/^\d{9,11}$/.test(formData.phone.replace(/[^\d]/g, ''))) {
        errors.phone = 'Số điện thoại không hợp lệ (9-11 chữ số)';
    }
    if (!formData.password) {
        errors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
        errors.password = 'Mật khẩu phải ít nhất 6 ký tự';
    }
    if (!formData.confirmPassword) {
        errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    return errors;
};

export const validateLoginForm = (formData: LoginFormData): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!formData.username.trim()) {
        errors.username = 'Tên đăng nhập không được để trống';
    }
    if (!formData.password) {
        errors.password = 'Mật khẩu không được để trống';
    }

    return errors;
};