import React, { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaFacebook, FaTwitter, FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import { validateLoginForm } from '../../utils/formValidation';

interface JwtPayload {
    sub: string;
    roles?: string[];
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

    const decodeJwt = (token: string): JwtPayload => {
        try {
            const base64Url = token.split('.')[1];
            if (!base64Url) {
                return { sub: '', roles: [] };
            }
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload) as JwtPayload;
        } catch (error) {
            console.warn('Không decode được token:', error);
            return { sub: '', roles: [] };
        }
    };

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
            const data = await loginUser({ username, password });

            const token = data.token;
            let roles: string[] = data.roles || [];
            if (!roles.length && token) {
                try {
                    const decoded: JwtPayload = decodeJwt(token);
                    roles = decoded.roles || [];
                } catch (decodeError) {
                    console.warn('Không decode được roles từ token');
                }
            }

            if (remember) localStorage.setItem('jwtToken', token);
            else sessionStorage.setItem('jwtToken', token);

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
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-teal-700 mb-2">Đăng nhập</h1>
                        <p className="text-gray-600">Chào mừng quay trở lại WonderTrail</p>
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

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tên đăng nhập
                            </label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-3 text-gray-500" size={20} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={handleChangeUsername}
                                    placeholder="Nhập tên đăng nhập"
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${errors.username ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                            </div>
                            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-3 text-gray-500" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={handleChangePassword}
                                    placeholder="Nhập mật khẩu"
                                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-3 text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={() => setRemember(!remember)}
                                    className="accent-teal-600"
                                />
                                Ghi nhớ đăng nhập
                            </label>
                            <a href="#" className="text-teal-600 hover:underline">
                                Quên mật khẩu?
                            </a>
                        </div>

                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className={`w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                        </button>

                        <div className="mt-8">
                            <div className="flex items-center">
                                <hr className="flex-grow border-t border-gray-300" />
                                <span className="mx-4 text-gray-500 text-sm font-medium">hoặc tiếp tục với</span>
                                <hr className="flex-grow border-t border-gray-300" />
                            </div>

                            <div className="flex justify-center gap-4 mt-6">
                                <button
                                    type="button"
                                    className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-200 transform hover:scale-110 shadow-lg"
                                    aria-label="Đăng nhập với Facebook"
                                >
                                    <FaFacebook size={20} />
                                </button>

                                <button
                                    type="button"
                                    className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-all duration-200 transform hover:scale-110 shadow-lg"
                                    aria-label="Đăng nhập với Twitter"
                                >
                                    <FaTwitter size={20} />
                                </button>

                                <button
                                    type="button"
                                    className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-all duration-200 transform hover:scale-110 shadow-lg"
                                    aria-label="Đăng nhập với Google"
                                >
                                    <FaGoogle size={20} />
                                </button>
                            </div>
                        </div>

                        <p className="text-center">
                            Chưa có tài khoản?{' '}
                            <button
                                onClick={() => navigate('/register')}
                                className="text-teal-600 font-semibold hover:underline"
                            >
                                Đăng ký
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;