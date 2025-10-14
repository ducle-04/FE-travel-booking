import React, { useState } from 'react';
import { User, Mail, Lock, Facebook, Github, Chrome } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthPagesProps {
    onAuthSuccess?: () => void;
}

interface FormData {
    username: string;
    email: string;
    password: string;
}

const AuthPages: React.FC<AuthPagesProps> = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        if (onAuthSuccess) {
            onAuthSuccess();
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-200 to-blue-200">
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      `}</style>

            <div className={`relative w-[850px] h-[550px] bg-white mx-5 rounded-3xl shadow-2xl overflow-hidden ${isLogin ? '' : 'active'}`}>
                {/* Form Đăng nhập */}
                <AnimatePresence>
                    <motion.div
                        key="login-form"
                        initial={{ right: isLogin ? '0%' : '50%' }}
                        animate={{ right: isLogin ? '0%' : '50%' }}
                        transition={{ duration: 0.6, ease: 'easeInOut', delay: 1.2 }}
                        className={`absolute w-1/2 h-full bg-white flex items-center justify-center text-gray-800 text-center p-10 z-10 ${isLogin ? '' : 'lg:right-1/2'}`}
                    >
                        <form className="w-full">
                            <h1 className="text-4xl mb-[-10px] font-bold">Đăng Nhập</h1>
                            <div className="relative my-7 animate-fadeIn">
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Tên người dùng"
                                    required
                                    className="w-full p-3 pl-5 pr-12 bg-gray-100 rounded-lg outline-none text-base font-medium text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                                />
                                <User className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-gray-500" size={20} />
                            </div>
                            <div className="relative my-7 animate-fadeIn">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Mật khẩu"
                                    required
                                    className="w-full p-3 pl-5 pr-12 bg-gray-100 rounded-lg outline-none text-base font-medium text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                                />
                                <Lock className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-gray-500" size={20} />
                            </div>
                            <div className="my-[-15px] mb-4">
                                <a href="#" className="text-sm text-gray-800 hover:underline">Quên mật khẩu?</a>
                            </div>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="w-full h-12 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                            >
                                Đăng Nhập
                            </button>
                            <p className="text-sm my-4">hoặc đăng nhập bằng nền tảng xã hội</p>
                            <div className="flex justify-center gap-2">
                                <button className="p-2 border-2 border-gray-300 rounded-lg text-2xl text-gray-800 hover:bg-gray-100">
                                    <Chrome size={24} />
                                </button>
                                <button className="p-2 border-2 border-gray-300 rounded-lg text-2xl text-gray-800 hover:bg-gray-100">
                                    <Facebook size={24} />
                                </button>
                                <button className="p-2 border-2 border-gray-300 rounded-lg text-2xl text-gray-800 hover:bg-gray-100">
                                    <Github size={24} />
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    {/* Form Đăng ký */}
                    <motion.div
                        key="register-form"
                        initial={{ right: isLogin ? '0%' : '50%' }}
                        animate={{ right: isLogin ? '0%' : '50%' }}
                        transition={{ duration: 0.6, ease: 'easeInOut', delay: 1.2 }}
                        className={`absolute w-1/2 h-full bg-white flex items-center justify-center text-gray-800 text-center p-10 z-10 ${isLogin ? 'invisible' : 'lg:right-1/2'}`}
                    >
                        <form className="w-full">
                            <h1 className="text-4xl mb-[-10px] font-bold">Đăng Ký</h1>
                            <div className="relative my-7 animate-fadeIn">
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Tên người dùng"
                                    required
                                    className="w-full p-3 pl-5 pr-12 bg-gray-100 rounded-lg outline-none text-base font-medium text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                                />
                                <User className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-gray-500" size={20} />
                            </div>
                            <div className="relative my-7 animate-fadeIn">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    required
                                    className="w-full p-3 pl-5 pr-12 bg-gray-100 rounded-lg outline-none text-base font-medium text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                                />
                                <Mail className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-gray-500" size={20} />
                            </div>
                            <div className="relative my-7 animate-fadeIn">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Mật khẩu"
                                    required
                                    className="w-full p-3 pl-5 pr-12 bg-gray-100 rounded-lg outline-none text-base font-medium text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                                />
                                <Lock className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-gray-500" size={20} />
                            </div>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="w-full h-12 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                            >
                                Đăng Ký
                            </button>
                            <p className="text-sm my-4">hoặc đăng ký bằng nền tảng xã hội</p>
                            <div className="flex justify-center gap-2">
                                <button className="p-2 border-2 border-gray-300 rounded-lg text-2xl text-gray-800 hover:bg-gray-100">
                                    <Chrome size={24} />
                                </button>
                                <button className="p-2 border-2 border-gray-300 rounded-lg text-2xl text-gray-800 hover:bg-gray-100">
                                    <Facebook size={24} />
                                </button>
                                <button className="p-2 border-2 border-gray-300 rounded-lg text-2xl text-gray-800 hover:bg-gray-100">
                                    <Github size={24} />
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    {/* Panel Chuyển đổi */}
                    <div className="absolute w-full h-full">
                        <motion.div
                            key="toggle-background"
                            initial={{ left: isLogin ? '-250%' : '50%' }}
                            animate={{ left: isLogin ? '-250%' : '50%' }}
                            transition={{ duration: 1.8, ease: 'easeInOut' }}
                            className="absolute w-[300%] h-full bg-blue-500 rounded-[150px] z-10"
                        ></motion.div>
                        <motion.div
                            key="toggle-left"
                            initial={{ left: isLogin ? '0%' : '-50%' }}
                            animate={{ left: isLogin ? '0%' : '-50%' }}
                            transition={{ duration: 0.6, ease: 'easeInOut', delay: 1.2 }}
                            className="absolute w-1/2 h-full flex flex-col justify-center items-center text-white z-20"
                        >
                            <h1 className="text-4xl font-bold">Xin chào, chào mừng bạn!</h1>
                            <p className="text-sm mb-5">Bạn chưa có tài khoản?</p>
                            <button
                                type="button"
                                onClick={() => setIsLogin(false)}
                                className="w-40 h-11 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-500 transition"
                            >
                                Đăng Ký
                            </button>
                        </motion.div>
                        <motion.div
                            key="toggle-right"
                            initial={{ right: isLogin ? '-50%' : '0%' }}
                            animate={{ right: isLogin ? '-50%' : '0%' }}
                            transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.6 }}
                            className="absolute w-1/2 h-full flex flex-col justify-center items-center text-white z-20"
                        >
                            <h1 className="text-4xl font-bold">Chào mừng bạn trở lại!</h1>
                            <p className="text-sm mb-5">Bạn đã có tài khoản?</p>
                            <button
                                type="button"
                                onClick={() => setIsLogin(true)}
                                className="w-40 h-11 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-500 transition"
                            >
                                Đăng Nhập
                            </button>
                        </motion.div>
                    </div>
                </AnimatePresence>

                {/* Panel Chuyển đổi trên Mobile */}
                <div className="lg:hidden bg-blue-500 p-8 text-center text-white space-y-4">
                    <h2 className="text-2xl font-bold">
                        {isLogin ? 'Xin chào, chào mừng bạn!' : 'Chào mừng bạn trở lại!'}
                    </h2>
                    <p className="text-white/80 font-light">
                        {isLogin ? 'Bạn chưa có tài khoản?' : 'Bạn đã có tài khoản?'}
                    </p>
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="w-full border-2 border-white text-white px-6 py-2 rounded-full font-bold hover:bg-white hover:text-blue-500 transition"
                    >
                        {isLogin ? 'Đăng Ký' : 'Đăng Nhập'}
                    </button>
                </div>
            </div>

            {/* Responsive Styles */}
            <style>{`
        @media screen and (max-width: 650px) {
          .container { height: calc(100vh - 40px); }
          .container > div:nth-child(1), .container > div:nth-child(2) {
            bottom: 0;
            width: 100%;
            height: 70%;
          }
          .container.active > div:nth-child(1), .container.active > div:nth-child(2) {
            right: 0;
            bottom: 30%;
          }
          .container > div:nth-child(3) > div:nth-child(1) {
            left: 0;
            top: -270%;
            width: 100%;
            height: 300%;
            border-radius: 20vw;
          }
          .container.active > div:nth-child(3) > div:nth-child(1) {
            left: 0;
            top: 70%;
          }
          .container.active > div:nth-child(3) > div:nth-child(2) {
            left: 0;
            top: -30%;
          }
          .container > div:nth-child(3) > div:nth-child(2) {
            top: 0;
            width: 100%;
            height: 30%;
          }
          .container > div:nth-child(3) > div:nth-child(3) {
            right: 0;
            bottom: -30%;
            width: 100%;
            height: 30%;
          }
          .container.active > div:nth-child(3) > div:nth-child(3) {
            bottom: 0;
          }
        }
        @media screen and (max-width: 400px) {
          .container > div:nth-child(1), .container > div:nth-child(2) {
            padding: 20px;
          }
          .container > div:nth-child(3) > div:nth-child(2) h1,
          .container > div:nth-child(3) > div:nth-child(3) h1 {
            font-size: 30px;
          }
        }
      `}</style>
        </div>
    );
};

export default AuthPages;