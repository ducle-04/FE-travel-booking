import { Send, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';

interface TravelDealsPageProps { }

const TravelDealsPage: React.FC<TravelDealsPageProps> = () => {
    const [email, setEmail] = useState('');

    const handleSubscribe = () => {
        if (email) {
            alert(`Đã đăng ký với email: ${email}`);
            setEmail('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
            <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center">
                {/* Left Card - Special Deals */}
                <div
                    className="relative h-[420px] rounded-2xl overflow-hidden transition-all duration-500"
                >
                    <img
                        src="https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80"
                        alt="Gia đình tại bãi biển"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500" />

                    <div className="relative h-full flex flex-col justify-end p-10 text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                            Khám Phá Ưu Đãi Đặc Biệt
                        </h1>
                        <p className="text-base mb-6 text-white/90">
                            Mở khóa các chương trình khuyến mãi độc quyền cho kỳ nghỉ mơ ước của bạn.
                        </p>
                        <button className="bg-teal-500 text-white font-medium px-8 py-3 rounded-lg transition-colors w-fit flex items-center gap-2"> {/* Thay blue-500 bằng teal-500, bỏ hover */}
                            Xem Tour <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Right Card - Newsletter */}
                <div
                    className="bg-gray-50 rounded-2xl p-12 h-[420px] flex flex-col justify-between transition-all duration-500"
                >
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">
                            Cập Nhật Thông Tin
                        </h2>
                        <p className="text-gray-500 text-base mb-6">
                            Đăng ký bản tin của chúng tôi để nhận các ưu đãi độc quyền.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Send className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Địa Chỉ Email Của Bạn"
                                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-full focus:outline-none focus:border-teal-400 transition-colors text-gray-700 placeholder-gray-400"
                            />
                        </div>
                        <button
                            onClick={handleSubscribe}
                            className="bg-teal-500 text-white font-medium px-10 py-3.5 rounded-full transition-colors uppercase text-sm tracking-wide"
                        >
                            Đăng Ký
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TravelDealsPage;