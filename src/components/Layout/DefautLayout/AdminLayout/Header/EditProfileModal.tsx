import React, { useState } from 'react';
import { X } from 'lucide-react';
import { updateUserProfile } from '../../../../../services/userService';
import { useTheme } from '../../../../../context/ThemeContext';

interface ProfileData {
    username: string;
    email: string;
    fullname: string;
    phoneNumber: string;
}

interface EditProfileModalProps {
    profile: ProfileData;
    onClose: () => void;
    onUpdate: (updatedProfile: ProfileData) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ profile, onClose, onUpdate }) => {
    const { theme } = useTheme();
    const [formData, setFormData] = useState<ProfileData>({
        username: profile.username,
        email: profile.email,
        fullname: profile.fullname,
        phoneNumber: profile.phoneNumber,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'email') return; // Không cho sửa email
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');
            if (!token) throw new Error('Vui lòng đăng nhập lại.');

            const payload = {
                username: formData.username,
                fullname: formData.fullname,
                phoneNumber: formData.phoneNumber,
            };

            const updatedProfile = await updateUserProfile(token, payload);
            onUpdate(updatedProfile);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Không thể cập nhật hồ sơ. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                {/* Header */}
                <div className={`sticky top-0 bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-4 flex items-center justify-between border-b-2 border-slate-900`}>
                    <h2 className="text-xl font-bold">Chỉnh sửa hồ sơ</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-600 rounded-lg transition-colors"
                        disabled={loading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-5 mb-6">
                        {/* Username (Disabled) */}
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                }`}>Tài khoản</label>
                            <input
                                type="text"
                                value={formData.username}
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-gray-100 text-gray-600 cursor-not-allowed ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                                    }`}
                                disabled
                            />
                            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>Không thể thay đổi</p>
                        </div>

                        {/* Email (Disabled) */}
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                }`}>Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-gray-100 text-gray-600 cursor-not-allowed ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                                    }`}
                                disabled
                            />
                            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>Không thể thay đổi</p>
                        </div>

                        {/* Fullname */}
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                }`}>Họ tên *</label>
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                                placeholder="Nhập họ tên"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                }`}>Số điện thoại *</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                                placeholder="0123456789"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={`flex justify-end gap-3 pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                        <button
                            type="button"
                            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 disabled:opacity-50 ${theme === 'dark' ? 'text-gray-200 bg-gray-700 hover:bg-gray-600' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                                }`}
                            onClick={onClose}
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg ${theme === 'dark' ? 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white' : 'bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white'
                                }`}
                            disabled={loading}
                        >
                            {loading ? 'Đang lưu...' : 'Lưu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;