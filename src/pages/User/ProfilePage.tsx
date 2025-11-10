import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, User, Mail, Phone, Key, ArrowLeft, Edit3, Save, X, Eye, EyeOff, Camera, Trash2 } from 'lucide-react';
import { validateUpdateProfileForm } from '../../utils/formValidation';
import { fetchUserProfile, updateUserProfile, uploadAvatar, deleteAvatar } from '../../services/userService';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface ProfileFormData {
    username: string;
    fullName: string;
    email: string;
    phone: string;
    currentPassword: string;
    newPassword: string;
    avatarUrl?: string;
}

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isResettingPassword, setIsResettingPassword] = useState<boolean>(false);
    const [formData, setFormData] = useState<ProfileFormData>({
        username: '',
        fullName: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        avatarUrl: undefined,
    });
    const [originalData, setOriginalData] = useState<ProfileFormData>({ ...formData });
    const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});
    const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [updateLoading, setUpdateLoading] = useState<boolean>(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState<boolean>(false);

    const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');

    useEffect(() => {
        if (!token) {
            toast.error('Vui lòng đăng nhập để xem thông tin cá nhân.', { position: 'top-right', autoClose: 5000 });
            navigate('/login');
            setLoading(false);
            return;
        }

        const loadProfile = async () => {
            try {
                const userData = await fetchUserProfile(token);
                const profileData: ProfileFormData = {
                    username: userData.username || '',
                    fullName: userData.fullname || '',
                    email: userData.email || '',
                    phone: userData.phoneNumber || '',
                    currentPassword: '',
                    newPassword: '',
                    avatarUrl: userData.avatarUrl,
                };
                setFormData(profileData);
                setOriginalData(profileData);
            } catch (error: any) {
                console.error('Lỗi khi tải profile:', error);
                if (error.message.includes('Phiên đăng nhập đã hết hạn') || error.response?.status === 401) {
                    toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', { position: 'top-right', autoClose: 5000 });
                    localStorage.removeItem('jwtToken');
                    sessionStorage.removeItem('jwtToken');
                    navigate('/login');
                } else {
                    toast.error(error.message || 'Không thể tải thông tin profile. Vui lòng thử lại.', { position: 'top-right', autoClose: 5000 });
                }
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, [token, navigate]);

    const validateForm = () => {
        const newErrors = validateUpdateProfileForm(formData, isResettingPassword);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof ProfileFormData]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name as keyof ProfileFormData];
                return newErrors;
            });
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Kích thước ảnh không được vượt quá 5MB');
                return;
            }
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({ ...prev, avatarUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadAvatar = async () => {
        if (!avatarFile) return;
        setIsUploadingAvatar(true);
        try {
            const newUrl = await uploadAvatar(token!, avatarFile);
            setFormData(prev => ({ ...prev, avatarUrl: newUrl }));
            setOriginalData(prev => ({ ...prev, avatarUrl: newUrl }));
            setAvatarFile(null);
            toast.success('Cập nhật ảnh đại diện thành công!');
        } catch (error: any) {
            toast.error(error.message || 'Upload ảnh thất bại.');
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleRemoveAvatar = async () => {
        Swal.fire({
            title: 'Xác nhận',
            text: 'Bạn có chắc muốn xóa ảnh đại diện?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#64748b',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteAvatar(token!);
                    setFormData(prev => ({ ...prev, avatarUrl: undefined }));
                    setOriginalData(prev => ({ ...prev, avatarUrl: undefined }));
                    setAvatarFile(null);
                    toast.success('Đã xóa ảnh đại diện.');
                } catch (error: any) {
                    toast.error(error.message || 'Xóa ảnh thất bại.');
                }
            }
        });
    };

    const handleUpdate = async () => {
        if (!validateForm()) {
            toast.error(Object.values(errors).join(' '), { position: 'top-right', autoClose: 5000 });
            return;
        }

        Swal.fire({
            title: 'Xác nhận',
            text: isResettingPassword ? 'Bạn có chắc muốn đặt lại mật khẩu?' : 'Bạn có chắc muốn lưu thay đổi?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Lưu',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#64748b',
        }).then((result) => {
            if (result.isConfirmed) {
                handleConfirmUpdate();
            }
        });
    };

    const handleConfirmUpdate = async () => {
        setUpdateLoading(true);
        try {
            const updateData = {
                username: formData.username,
                fullname: formData.fullName,
                phoneNumber: formData.phone,
                ...(isResettingPassword && formData.currentPassword && formData.newPassword && {
                    password: formData.newPassword,
                }),
            };

            const updatedUser = await updateUserProfile(token!, updateData);

            const updatedProfile: ProfileFormData = {
                username: updatedUser.username,
                fullName: updatedUser.fullname,
                email: updatedUser.email,
                phone: updatedUser.phoneNumber,
                currentPassword: '',
                newPassword: '',
                avatarUrl: updatedUser.avatarUrl,
            };

            setFormData(updatedProfile);
            setOriginalData(updatedProfile);

            toast.success(isResettingPassword ? 'Đặt lại mật khẩu thành công!' : 'Cập nhật hồ sơ thành công!');
            setErrors({});
            setTimeout(() => {
                setIsEditing(false);
                setIsResettingPassword(false);
            }, 1500);
        } catch (error: any) {
            if (error.message.includes('Phiên đăng nhập đã hết hạn') || error.response?.status === 401) {
                toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                localStorage.removeItem('jwtToken');
                sessionStorage.removeItem('jwtToken');
                navigate('/login');
            } else {
                toast.error(error.message || (isResettingPassword ? 'Đặt lại mật khẩu thất bại.' : 'Cập nhật hồ sơ thất bại.'));
            }
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData(originalData);
        setErrors({});
        setIsEditing(false);
        setIsResettingPassword(false);
        setAvatarFile(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center items-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                    <p className="text-slate-600 font-medium">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <ToastContainer />
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8 mt-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200 mb-4 group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                        Quay lại
                    </button>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Hồ sơ của tôi</h1>
                    <p className="text-slate-600">Quản lý thông tin cá nhân</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* === AVATAR CARD === */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg p-8 border border-slate-200">
                            <div className="text-center">
                                <div className="relative mx-auto w-32 h-32 mb-6 group">
                                    {formData.avatarUrl ? (
                                        <img
                                            src={formData.avatarUrl}
                                            alt="Avatar"
                                            className="w-full h-full rounded-full object-cover border-4 border-slate-100"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center">
                                            <User className="w-16 h-16 text-white" />
                                        </div>
                                    )}
                                    {/* Hover để chọn ảnh */}
                                    <label className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="w-8 h-8 text-white" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                <h2 className="text-2xl font-bold text-slate-900 mb-2">{formData.fullName || 'Chưa cập nhật'}</h2>
                                <p className="text-slate-600 mb-4">@{formData.username}</p>
                                <div className="flex items-center justify-center text-slate-600 mb-2">
                                    <Mail className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{formData.email}</span>
                                </div>
                                {formData.phone && (
                                    <div className="flex items-center justify-center text-slate-600 mb-2">
                                        <Phone className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{formData.phone}</span>
                                    </div>
                                )}
                            </div>

                            {/* === NÚT CẬP NHẬT AVATAR RIÊNG BIỆT === */}
                            <div className="mt-8 pt-6 border-t border-slate-200 space-y-3">
                                {/* Nếu có file mới → hiện nút Upload */}
                                {avatarFile && (
                                    <button
                                        onClick={handleUploadAvatar}
                                        disabled={isUploadingAvatar}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isUploadingAvatar ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Đang tải lên...
                                            </>
                                        ) : (
                                            <>
                                                <Camera className="w-4 h-4" />
                                                Cập nhật ảnh đại diện
                                            </>
                                        )}
                                    </button>
                                )}

                                {/* Nếu đang có avatar → hiện nút Xóa */}
                                {formData.avatarUrl && !avatarFile && (
                                    <button
                                        onClick={handleRemoveAvatar}
                                        className="w-full border border-red-300 text-red-600 py-2 px-4 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Xóa ảnh đại diện
                                    </button>
                                )}

                                {/* Luôn hiện nút "Chọn ảnh" nếu chưa có file */}
                                {!avatarFile && (
                                    <label className="w-full bg-cyan-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-cyan-700 transition-all duration-300 flex items-center justify-center cursor-pointer">
                                        <Camera className="w-5 h-5 mr-2" />
                                        Chọn ảnh đại diện
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}

                                {/* Nút đặt lại mật khẩu */}
                                {!isResettingPassword && (
                                    <button
                                        onClick={() => setIsResettingPassword(true)}
                                        className="w-full bg-slate-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-slate-800 transition-all duration-300 flex items-center justify-center"
                                    >
                                        <Key className="w-5 h-5 mr-2" />
                                        Đặt lại mật khẩu
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* === FORM CARD === */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg p-8 border border-slate-200">
                            <div className="flex items-center mb-8">
                                <Edit3 className="w-6 h-6 text-cyan-600 mr-3" />
                                <h2 className="text-2xl font-bold text-slate-900">
                                    {isResettingPassword ? 'Đặt lại mật khẩu' : isEditing ? 'Chỉnh sửa thông tin' : 'Thông tin hồ sơ'}
                                </h2>
                            </div>

                            <div className="space-y-6">
                                {!isEditing && !isResettingPassword ? (
                                    <>
                                        <div className="group">
                                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                                                <User className="w-4 h-4 mr-2 text-slate-500" />
                                                Tên đăng nhập
                                            </label>
                                            <div className="px-4 py-3 rounded-lg bg-slate-50 text-slate-600">{formData.username}</div>
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                                                <User className="w-4 h-4 mr-2 text-slate-500" />
                                                Họ và tên
                                            </label>
                                            <div className="px-4 py-3 rounded-lg bg-slate-50 text-slate-600">{formData.fullName}</div>
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                                                <Mail className="w-4 h-4 mr-2 text-slate-500" />
                                                Email
                                            </label>
                                            <div className="px-4 py-3 rounded-lg bg-slate-50 text-slate-600">{formData.email}</div>
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                                                <Phone className="w-4 h-4 mr-2 text-slate-500" />
                                                Số điện thoại
                                            </label>
                                            <div className="px-4 py-3 rounded-lg bg-slate-50 text-slate-600">{formData.phone || 'Chưa cập nhật'}</div>
                                        </div>
                                        <div className="pt-6">
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="w-full bg-cyan-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-cyan-700 transition-all duration-300 flex items-center justify-center"
                                            >
                                                <Edit3 className="w-5 h-5 mr-2" />
                                                Chỉnh sửa hồ sơ
                                            </button>
                                        </div>
                                    </>
                                ) : isEditing ? (
                                    <>
                                        <div className="group">
                                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                                                <User className="w-4 h-4 mr-2 text-slate-500" />
                                                Tên đăng nhập
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.username}
                                                className="w-full border border-slate-300 p-4 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
                                                disabled
                                            />
                                        </div>

                                        <div className="group">
                                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                                                <User className="w-4 h-4 mr-2 text-slate-500" />
                                                Họ và tên <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                placeholder="Nhập họ và tên"
                                                className={`w-full border p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 ${errors.fullName ? 'border-red-400' : 'border-slate-300'}`}
                                                disabled={updateLoading}
                                            />
                                            {errors.fullName && <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>}
                                        </div>

                                        <div className="group">
                                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                                                <Mail className="w-4 h-4 mr-2 text-slate-500" />
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                className="w-full border border-slate-300 p-4 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
                                                disabled
                                            />
                                        </div>

                                        <div className="group">
                                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                                                <Phone className="w-4 h-4 mr-2 text-slate-500" />
                                                Số điện thoại
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Nhập số điện thoại"
                                                className={`w-full border p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 ${errors.phone ? 'border-red-400' : 'border-slate-300'}`}
                                                disabled={updateLoading}
                                            />
                                            {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                                        </div>

                                        <div className="pt-6 flex gap-4">
                                            <button
                                                className="flex-1 bg-cyan-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-cyan-700 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                                                onClick={handleUpdate}
                                                disabled={updateLoading}
                                            >
                                                {updateLoading ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                        Đang lưu...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-5 h-5 mr-2" />
                                                        Lưu thay đổi
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="flex-1 border border-slate-300 text-slate-700 font-medium py-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <X className="w-5 h-5" />
                                                Hủy
                                            </button>
                                        </div>
                                    </>
                                ) : isResettingPassword ? (
                                    <>
                                        <div className="group">
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="block text-sm font-medium text-slate-700 flex items-center">
                                                    <Key className="w-4 h-4 mr-2 text-slate-500" />
                                                    Mật khẩu hiện tại <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    className="text-slate-600 hover:text-slate-900 focus:outline-none"
                                                >
                                                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            <input
                                                type={showCurrentPassword ? 'text' : 'password'}
                                                name="currentPassword"
                                                value={formData.currentPassword}
                                                onChange={handleChange}
                                                placeholder="Nhập mật khẩu hiện tại"
                                                className={`w-full border p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 ${errors.currentPassword ? 'border-red-400' : 'border-slate-300'}`}
                                                disabled={updateLoading}
                                            />
                                            {errors.currentPassword && <p className="text-red-600 text-xs mt-1">{errors.currentPassword}</p>}
                                        </div>
                                        <div className="group">
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="block text-sm font-medium text-slate-700 flex items-center">
                                                    <Key className="w-4 h-4 mr-2 text-slate-500" />
                                                    Mật khẩu mới <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="text-slate-600 hover:text-slate-900 focus:outline-none"
                                                >
                                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            <input
                                                type={showNewPassword ? 'text' : 'password'}
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                placeholder="Nhập mật khẩu mới"
                                                className={`w-full border p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 ${errors.newPassword ? 'border-red-400' : 'border-slate-300'}`}
                                                disabled={updateLoading}
                                            />
                                            <p className="text-slate-600 text-xs mt-2">Mật khẩu phải từ 6 ký tự trở lên</p>
                                            {errors.newPassword && <p className="text-red-600 text-xs mt-1">{errors.newPassword}</p>}
                                        </div>
                                        <div className="pt-6 flex gap-4">
                                            <button
                                                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                                                onClick={handleUpdate}
                                                disabled={updateLoading}
                                            >
                                                {updateLoading ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                        Đang xử lý...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-5 h-5 mr-2" />
                                                        Đặt lại mật khẩu
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="flex-1 border border-slate-300 text-slate-700 font-medium py-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <X className="w-5 h-5" />
                                                Hủy
                                            </button>
                                        </div>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;