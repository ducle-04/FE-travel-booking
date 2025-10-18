import React, { useState } from 'react';
import { Eye, EyeOff, Facebook, Mail, Apple } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authService';
import { validateRegisterForm } from '../../utils/formValidation';

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        phone: '',
        password: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState('');
    const [serverError, setServerError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
        setServerError('');
    };

    const handleRegister = async (e: React.MouseEvent) => {
        e.preventDefault();
        const newErrors = validateRegisterForm(formData);

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setServerError('');

        try {
            const data = await registerUser({
                username: formData.username,
                password: formData.password,
                email: formData.email,
                fullname: formData.fullName,
                phoneNumber: formData.phone,
            });

            setSuccess(data || 'Đăng ký thành công!');
            setFormData({
                fullName: '',
                username: '',
                email: '',
                phone: '',
                password: '',
            });
            setErrors({});
            setTimeout(() => {
                navigate('/login');
            }, 500);
        } catch (error: any) {
            setServerError(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 py-8">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-slate-900 mb-2">
                        Tạo tài khoản
                    </h1>
                    <p className="text-slate-600">
                        Đã có tài khoản?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Đăng nhập
                        </button>
                    </p>
                </div>

                {/* Messages */}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 transition-opacity duration-500">
                        {success}
                    </div>
                )}
                {serverError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {serverError}
                    </div>
                )}

                {/* Form */}
                <div className="space-y-5">
                    {/* Full Name & Username Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Họ và tên
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Họ và tên"
                                className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.fullName
                                    ? 'border-red-400 focus:ring-red-200'
                                    : 'border-slate-300 focus:ring-blue-200'
                                    } bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2`}
                            />
                            {errors.fullName && (
                                <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>
                            )}
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Tên đăng nhập
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Tên đăng nhập"
                                className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.username
                                    ? 'border-red-400 focus:ring-red-200'
                                    : 'border-slate-300 focus:ring-blue-200'
                                    } bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2`}
                            />
                            {errors.username && (
                                <p className="text-red-600 text-xs mt-1">{errors.username}</p>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email của bạn là gì?
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Nhập địa chỉ email"
                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.email
                                ? 'border-red-400 focus:ring-red-200'
                                : 'border-slate-300 focus:ring-blue-200'
                                } bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2`}
                        />
                        {errors.email && (
                            <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Số điện thoại
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại"
                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.phone
                                ? 'border-red-400 focus:ring-red-200'
                                : 'border-slate-300 focus:ring-blue-200'
                                } bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2`}
                        />
                        {errors.phone && (
                            <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Tạo mật khẩu
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-slate-600 hover:text-slate-900 focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu"
                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.password
                                ? 'border-red-400 focus:ring-red-200'
                                : 'border-slate-300 focus:ring-blue-200'
                                } bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2`}
                        />
                        <p className="text-slate-600 text-xs mt-2">
                            Sử dụng 8 ký tự trở lên với hỗn hợp chữ cái, số & ký hiệu
                        </p>
                        {errors.password && (
                            <p className="text-red-600 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Terms */}
                    <p className="text-sm text-slate-600">
                        Bằng cách tạo tài khoản, bạn đồng ý với{' '}
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                            Điều khoản sử dụng
                        </button>{' '}
                        và{' '}
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                            Chính sách bảo mật
                        </button>
                    </p>

                    {/* Submit Button */}
                    <button
                        onClick={handleRegister}
                        disabled={loading}
                        className={`w-full bg-slate-400 hover:bg-slate-500 text-white font-semibold py-3 rounded-full transition-colors cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
                    </button>
                </div>

                {/* Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600">
                            Hoặc tiếp tục với
                        </span>
                    </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-3 gap-3">
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 border-2 border-slate-800 text-slate-800 font-semibold py-3 rounded-full hover:bg-slate-50 transition-colors"
                    >
                        <Facebook size={20} />
                        <span className="hidden sm:inline">Facebook</span>
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 border-2 border-slate-800 text-slate-800 font-semibold py-3 rounded-full hover:bg-slate-50 transition-colors"
                    >
                        <Mail size={20} />
                        <span className="hidden sm:inline">Google</span>
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 border-2 border-slate-800 text-slate-800 font-semibold py-3 rounded-full hover:bg-slate-50 transition-colors"
                    >
                        <Apple size={20} />
                        <span className="hidden sm:inline">Apple</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;