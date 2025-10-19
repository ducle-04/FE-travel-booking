import React, { useState } from 'react';
import { Eye, EyeOff, Facebook, Mail, Apple } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import { validateLoginForm } from '../../utils/formValidation';

interface LoginResponse {
    token: string;
    username: string;
    roles: string[];
}

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
    const [serverError, setServerError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        if (errors.username) {
            setErrors((prev) => ({ ...prev, username: undefined }));
        }
        setServerError('');
    };

    const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (errors.password) {
            setErrors((prev) => ({ ...prev, password: undefined }));
        }
        setServerError('');
    };

    const handleLogin = async (e: React.MouseEvent) => {
        e.preventDefault();
        const newErrors = validateLoginForm({ username, password });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setServerError('');
        setSuccess('');

        try {
            const data: LoginResponse = await loginUser({ username, password });

            const { token, roles } = data;

            if (remember) {
                localStorage.setItem('jwtToken', token);
                localStorage.setItem('roles', JSON.stringify(roles));
            } else {
                sessionStorage.setItem('jwtToken', token);
                sessionStorage.setItem('roles', JSON.stringify(roles));
            }

            setSuccess('Đăng nhập thành công!');
            setUsername('');
            setPassword('');
            setErrors({});

            setTimeout(() => {
                if (roles.includes('STAFF') || roles.includes('ADMIN')) {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }, 500);
        } catch (error: any) {
            setServerError(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-slate-900 mb-2">
                        Đăng nhập
                    </h1>
                    <p className="text-slate-600">
                        Chưa có tài khoản?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Đăng ký
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
                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Tên đăng nhập
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={handleChangeUsername}
                            placeholder="Nhập tên đăng nhập"
                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.username
                                ? 'border-red-400 focus:ring-red-200'
                                : 'border-slate-300 focus:ring-blue-200'
                                } bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2`}
                        />
                        {errors.username && (
                            <p className="text-red-600 text-xs mt-1">{errors.username}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Mật khẩu
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
                            value={password}
                            onChange={handleChangePassword}
                            placeholder="Nhập mật khẩu"
                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.password
                                ? 'border-red-400 focus:ring-red-200'
                                : 'border-slate-300 focus:ring-blue-200'
                                } bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2`}
                        />
                        {errors.password && (
                            <p className="text-red-600 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Remember & Forgot Password */}
                    <div className="flex justify-between items-center text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={() => setRemember(!remember)}
                                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                            />
                            <span className="text-slate-700">Ghi nhớ đăng nhập</span>
                        </label>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                            Quên mật khẩu?
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className={`w-full bg-slate-400 hover:bg-slate-500 text-white font-semibold py-3 rounded-full transition-colors cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
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

export default LoginPage;