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

interface AddUserFormData {
    username: string;
    password: string;
    email: string;
    fullname: string;
    phoneNumber: string;
    status: string;
    roles: string[];
}

interface User {
    id: number;
    username: string;
    email: string;
    fullname: string;
    phoneNumber: string;
    status: 'Hoạt động' | 'Không hoạt động' | 'Bị cấm' | 'Đã xóa';
    role: string;
    createdAt: string;
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

export const validateAddUserForm = (formData: AddUserFormData): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!formData.username.trim()) {
        errors.username = 'Tên đăng nhập không được để trống';
    } else if (formData.username.length < 3 || formData.username.length > 50) {
        errors.username = 'Tên đăng nhập phải từ 3 đến 50 ký tự';
    }

    if (!formData.password) {
        errors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
        errors.password = 'Mật khẩu phải ít nhất 6 ký tự';
    }

    if (!formData.email.trim()) {
        errors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Email không hợp lệ';
    } else if (formData.email.length > 100) {
        errors.email = 'Email không được vượt quá 100 ký tự';
    }

    if (!formData.fullname.trim()) {
        errors.fullname = 'Họ và tên không được để trống';
    } else if (formData.fullname.length < 2 || formData.fullname.length > 100) {
        errors.fullname = 'Họ và tên phải từ 2 đến 100 ký tự';
    }

    if (!formData.phoneNumber.trim()) {
        errors.phoneNumber = 'Số điện thoại không được để trống';
    } else if (!/^\+84[0-9]{9,12}$|^0[0-9]{9,12}$/.test(formData.phoneNumber)) {
        errors.phoneNumber = 'Số điện thoại không hợp lệ (9-12 chữ số, bắt đầu bằng +84 hoặc 0)';
    }

    if (!formData.roles || formData.roles.length === 0) {
        errors.roles = 'Vui lòng chọn ít nhất một vai trò';
    }

    if (!formData.status) {
        errors.status = 'Vui lòng chọn trạng thái';
    }

    return errors;
};

export const validateEditUserForm = (formData: User): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
        errors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Email không hợp lệ';
    } else if (formData.email.length > 100) {
        errors.email = 'Email không được vượt quá 100 ký tự';
    }

    if (!formData.fullname.trim()) {
        errors.fullname = 'Họ và tên không được để trống';
    } else if (formData.fullname.length < 2 || formData.fullname.length > 100) {
        errors.fullname = 'Họ và tên phải từ 2 đến 100 ký tự';
    }

    if (!formData.phoneNumber.trim()) {
        errors.phoneNumber = 'Số điện thoại không được để trống';
    } else if (!/^\+84[0-9]{9,12}$|^0[0-9]{9,12}$/.test(formData.phoneNumber)) {
        errors.phoneNumber = 'Số điện thoại không hợp lệ (9-12 chữ số, bắt đầu bằng +84 hoặc 0)';
    }

    if (!formData.role) {
        errors.role = 'Vui lòng chọn vai trò';
    }

    if (!formData.status) {
        errors.status = 'Vui lòng chọn trạng thái';
    }

    return errors;
};