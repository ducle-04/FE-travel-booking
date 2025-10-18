interface RegisterFormData {
    fullName: string;
    username: string;
    email: string;
    phone: string;
    password: string;
}

interface LoginFormData {
    username: string;
    password: string;
}

interface ProfileFormData {
    username: string;
    fullName: string;
    email: string;
    phone: string;
    currentPassword: string;
    newPassword: string;
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

export const validateUpdateProfileForm = (formData: ProfileFormData, isResettingPassword: boolean): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!isResettingPassword) {
        if (!formData.fullName.trim()) {
            errors.fullName = 'Họ và tên không được để trống';
        } else if (formData.fullName.length < 2 || formData.fullName.length > 100) {
            errors.fullName = 'Họ và tên phải từ 2 đến 100 ký tự';
        }
        if (!formData.email) {
            errors.email = 'Email không được để trống';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Email không hợp lệ';
        } else if (formData.email.length > 100) {
            errors.email = 'Email không được vượt quá 100 ký tự';
        }
        if (formData.phone && !/^\+84[0-9]{9,12}$|^0[0-9]{9,12}$/.test(formData.phone)) {
            errors.phone = 'Số điện thoại không hợp lệ (9-12 chữ số, bắt đầu bằng +84 hoặc 0)';
        }
    }

    if (isResettingPassword) {
        if (!formData.currentPassword) {
            errors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
        }
        if (!formData.newPassword) {
            errors.newPassword = 'Vui lòng nhập mật khẩu mới';
        } else if (formData.newPassword.length < 6) {
            errors.newPassword = 'Mật khẩu mới phải ít nhất 6 ký tự';
        }
    }

    return errors;
};