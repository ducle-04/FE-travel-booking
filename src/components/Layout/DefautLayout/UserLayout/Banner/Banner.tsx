// src/components/home/TravelBanner.tsx
import { Search, X, MapPin, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ImageBackground from "../../../../../assets/images/background/anh3.webp";
import { fetchDestinations, fetchTourCategories } from '../../../../../services/tourService';
import type { Destination, TourCategory } from '../../../../../services/tourService';

// Interface cho tour phổ biến từ API dashboard
interface PopularTour {
    tourId: number;
    tourName: string;
    imageUrl: string;
    destinationName: string;
    averageRating: number;
    bookingsCount: number;
    reviewsCount: number;
    popularityScore: number;
}

export default function TravelBanner() {
    const [keywords, setKeywords] = useState('');
    const [destination, setDestination] = useState('Bất kỳ');
    const [category, setCategory] = useState('Bất kỳ');

    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [categories, setCategories] = useState<TourCategory[]>([]);
    const [topTours, setTopTours] = useState<PopularTour[]>([]);
    const [showTopSuggestions, setShowTopSuggestions] = useState(false);

    const navigate = useNavigate();

    // Load điểm đến + loại tour
    useEffect(() => {
        Promise.all([fetchDestinations(), fetchTourCategories()])
            .then(([dests, cats]) => {
                setDestinations(dests);
                setCategories(cats);
            })
            .catch(console.error);
    }, []);

    // Load TOP tour phổ biến (chỉ chạy 1 lần)
    useEffect(() => {
        const fetchTopTours = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/dashboard/top-popular-tours');
                const data = res.data.data || res.data || [];
                setTopTours(data.slice(0, 6)); // lấy 6 tour hot nhất
            } catch (err) {
                console.error('Lỗi tải tour phổ biến:', err);
                setTopTours([]);
            }
        };
        fetchTopTours();
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (keywords.trim()) {
            params.append('searchKeyword', keywords.trim());
        }
        if (destination !== 'Bất kỳ') {
            params.append('searchLocation', destination);
        }
        if (category !== 'Bất kỳ') {
            params.append('selectedCategory', category);
        }

        navigate(`/tours?${params.toString()}`);
    };

    return (
        <section className="relative min-h-screen overflow-hidden" style={{
            backgroundImage: `url(${ImageBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            <div className="absolute inset-0 bg-white/70 backdrop-blur-md"></div>

            <section className="relative">
                <div className="max-w-7xl mx-auto px-6 py-16 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">

                        {/* Bên trái */}
                        <div className="z-20 flex flex-col justify-center pr-8">
                            <div className="inline-flex items-center bg-cyan-50 rounded-full px-4 py-2 w-fit mb-8">
                                <Link
                                    to="/tours"
                                    className="text-cyan-500 font-medium text-sm"
                                >
                                    Đặt Tour Với Chúng Tôi!
                                </Link>
                            </div>

                            <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                                Tìm Điểm Đến <br />
                                Tiếp Theo Để <span className="text-cyan-500">Khám Phá</span>
                            </h1>

                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                Khám phá những địa điểm tuyệt vời với các ưu đãi độc quyền.
                            </p>

                            {/* Form tìm kiếm - Cải thiện UI */}
                            <div className="bg-white rounded-2xl shadow-2xl p-6 relative z-30 w-full border border-gray-100">
                                <div className="space-y-4">
                                    {/* Hàng 1: Từ khóa (full width) */}
                                    <div className="flex flex-col relative">
                                        <label className="text-gray-700 font-semibold text-sm mb-2.5">Từ khóa</label>
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                                            <input
                                                type="text"
                                                placeholder="Nhập tên tour, địa điểm muốn khám phá..."
                                                value={keywords}
                                                onChange={(e) => setKeywords(e.target.value)}
                                                onFocus={() => setShowTopSuggestions(true)}
                                                onBlur={() => setTimeout(() => setShowTopSuggestions(false), 200)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                                className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:bg-white text-gray-700 text-sm transition-all"
                                            />

                                            {keywords && (
                                                <button
                                                    onClick={() => setKeywords('')}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10 transition-colors"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Danh sách TOP tour phổ biến - Hiển thị bên phải dạng grid 2 cột */}
                                        {showTopSuggestions && topTours.length > 0 && (
                                            <div className="absolute -top-12 left-full ml-6 w-[800px] bg-white rounded-xl shadow-2xl border-2 border-gray-100 z-50 max-h-[400px] overflow-hidden">
                                                <div className="px-4 py-3 bg-gradient-to-r from-cyan-50 to-blue-50 border-b-2 border-gray-100">
                                                    <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                                        <Star className="w-4 h-4 fill-cyan-500 text-cyan-500" />
                                                        Tour được yêu thích nhất
                                                    </p>
                                                </div>
                                                <div className="overflow-y-auto max-h-[330px] custom-scrollbar p-3">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {topTours.map((tour, index) => (
                                                            <div
                                                                key={tour.tourId}
                                                                onMouseDown={() => navigate(`/tour/${tour.tourId}`)}
                                                                className="p-3 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 cursor-pointer flex items-center gap-3 border border-gray-100 rounded-lg transition-all group hover:shadow-md"
                                                            >
                                                                {/* Số thứ tự */}
                                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 group-hover:bg-cyan-500 flex items-center justify-center transition-colors">
                                                                    <span className="text-xs font-bold text-gray-600 group-hover:text-white">{index + 1}</span>
                                                                </div>

                                                                {/* Hình ảnh */}
                                                                <img
                                                                    src={tour.imageUrl || 'https://via.placeholder.com/80'}
                                                                    alt={tour.tourName}
                                                                    className="w-14 h-14 object-cover rounded-lg flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow"
                                                                    onError={e => e.currentTarget.src = 'https://via.placeholder.com/80?text=Hot'}
                                                                />

                                                                {/* Thông tin tour */}
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-semibold text-gray-900 truncate text-xs mb-1 group-hover:text-cyan-600 transition-colors">
                                                                        {tour.tourName}
                                                                    </p>
                                                                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                                                                        <span className="flex items-center gap-1">
                                                                            <MapPin className="w-3 h-3 text-gray-500" />
                                                                            <span className="truncate">{tour.destinationName}</span>
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="flex items-center gap-1 text-xs">
                                                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                                            <span className="font-semibold text-gray-700">{tour.averageRating.toFixed(1)}</span>
                                                                        </span>
                                                                        <span className="text-cyan-600 font-bold text-xs">{tour.bookingsCount.toLocaleString('vi-VN')}+ đặt</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Hàng 2: Điểm đến + Loại tour + Nút tìm kiếm */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {/* Điểm đến */}
                                        <div className="flex flex-col">
                                            <label className="text-gray-700 font-semibold text-sm mb-2.5">Điểm đến</label>
                                            <select
                                                value={destination}
                                                onChange={(e) => setDestination(e.target.value)}
                                                className="px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:bg-white text-gray-700 text-sm transition-all cursor-pointer"
                                            >
                                                <option>Bất kỳ</option>
                                                {destinations.map(d => (
                                                    <option key={d.id}>{d.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Loại tour */}
                                        <div className="flex flex-col">
                                            <label className="text-gray-700 font-semibold text-sm mb-2.5">Loại tour</label>
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:bg-white text-gray-700 text-sm transition-all cursor-pointer"
                                            >
                                                <option>Bất kỳ</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Nút tìm kiếm */}
                                        <div className="flex flex-col justify-end">
                                            <button
                                                onClick={handleSearch}
                                                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                            >
                                                <Search className="w-5 h-5" />
                                                <span>Tìm kiếm</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bên phải */}
                        <div className="relative hidden lg:flex justify-end">
                            <img
                                src={ImageBackground}
                                alt="Hồ Núi"
                                className="w-[480px] h-[620px] object-cover rounded-3xl shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CSS cho custom scrollbar */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </section>
    );
}