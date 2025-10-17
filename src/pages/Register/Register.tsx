import React, { useState } from 'react';
import { FaUser, FaUserTag, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
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
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
                confirmPassword: '',
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
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-teal-700 mb-2">Đăng ký</h1>
                        <p className="text-gray-600">Tạo tài khoản mới trên WonderTrail</p>
                    </div>

                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 transition-opacity duration-500">
                            {success}
                        </div>
                    )}

                    {serverError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {serverError}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Họ và tên
                            </label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-3 text-gray-500" size={20} />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Nhập họ và tên"
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                            </div>
                            {errors.fullName && (
                                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tên đăng nhập
                            </label>
                            <div className="relative">
                                <FaUserTag className="absolute left-3 top-3 text-gray-500" size={20} />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Nhập tên đăng nhập"
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${errors.username ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                            </div>
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-3 text-gray-500" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Nhập email"
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Số điện thoại
                            </label>
                            <div className="relative">
                                <FaPhone className="absolute left-3 top-3 text-gray-500" size={20} />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Nhập số điện thoại"
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                            </div>
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-3 text-gray-500" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Nhập mật khẩu"
                                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Xác nhận mật khẩu
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-3 text-gray-500" size={20} />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Nhập lại mật khẩu"
                                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <button
                            onClick={handleRegister}
                            disabled={loading}
                            className={`w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition duration-300 mt-6 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Đang xử lý...' : 'Đăng ký'}
                        </button>
                    </div>

                    <p className="text-center text-gray-600 mt-6">
                        Đã có tài khoản?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-teal-600 hover:text-teal-700 font-semibold"
                        >
                            Đăng nhập
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;