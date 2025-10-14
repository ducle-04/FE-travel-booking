import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
    const navigate = useNavigate();

    const handleLogin = (e: React.MouseEvent) => {
        e.preventDefault();
        const newErrors: { username?: string; password?: string } = {};

        if (!username.trim()) newErrors.username = 'Tên đăng nhập không được để trống';
        if (!password) newErrors.password = 'Mật khẩu không được để trống';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        alert(`Đăng nhập thành công!\nTên đăng nhập: ${username}\nGhi nhớ: ${remember ? "Có" : "Không"}`);
        setUsername('');
        setPassword('');
        setErrors({});
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-teal-700 mb-2">Đăng nhập</h1>
                        <p className="text-gray-600">Chào mừng quay trở lại WonderTrail</p>
                    </div>

                    <div className="space-y-5">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tên đăng nhập
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-500" size={20} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Nhập tên đăng nhập"
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${errors.username ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                />
                            </div>
                            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu"
                                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-3 text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        </div>

                        {/* Remember me */}
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

                        {/* Login button */}
                        <button
                            onClick={handleLogin}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition"
                        >
                            Đăng nhập
                        </button>

                        {/* Social login */}
                        <div className="text-center text-gray-500 text-sm">Hoặc đăng nhập bằng</div>
                        <div className="grid grid-cols-3 gap-3">
                            <button className="border rounded-lg py-2 hover:bg-gray-50">🌐 Google</button>
                            <button className="border rounded-lg py-2 hover:bg-gray-50">📘 Facebook</button>
                            <button className="border rounded-lg py-2 hover:bg-gray-50">🐱 GitHub</button>
                        </div>

                        {/* Register redirect */}
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