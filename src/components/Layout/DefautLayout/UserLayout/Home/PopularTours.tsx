// src/components/home/PopularTours.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Star, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface PopularTour {
    tourId: number;
    tourName: string;
    imageUrl: string;
    destinationName: string;
    description?: string;
    views: number;
    bookingsCount: number;
    reviewsCount: number;
    averageRating: number;
    popularityScore: number;
}

const PopularTours: React.FC = () => {
    const [tours, setTours] = useState<PopularTour[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [expandedCard, setExpandedCard] = useState<number | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const navigate = useNavigate();
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const itemsPerView = 3;
    const maxIndex = Math.max(0, tours.length - itemsPerView);

    useEffect(() => {
        const fetchPopularTours = async () => {
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:8080/api/dashboard/top-popular-tours');
                setTours(res.data);
            } catch (err) {
                console.error('Lỗi tải tour phổ biến:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPopularTours();
    }, []);

    const handleNext = () => {
        if (!isTransitioning && tours.length > itemsPerView) {
            setIsTransitioning(true);
            setCurrentIndex(prev => (prev < maxIndex ? prev + 1 : 0));
            setTimeout(() => setIsTransitioning(false), 500);
        }
    };

    const handlePrev = () => {
        if (!isTransitioning && tours.length > itemsPerView) {
            setIsTransitioning(true);
            setCurrentIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
            setTimeout(() => setIsTransitioning(false), 500);
        }
    };

    const visibleTours = tours.slice(currentIndex, currentIndex + itemsPerView);

    if (loading) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600">Đang tải tour phổ biến...</p>
                </div>
            </section>
        );
    }

    if (tours.length === 0) return null;

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Tiêu đề + Nút Xem tất cả */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-5xl md:text-6xl font-bold mb-6">
                        Tour <span className="text-cyan-500">Phổ Biến Nhất</span>
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Được hàng nghìn du khách đặt chỗ và đánh giá cao
                    </p>
                    <motion.div whileHover={{ x: 8 }}>
                        <Link
                            to="/tours"
                            className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 font-semibold border-b-2 border-gray-400 hover:border-cyan-500 hover:text-cyan-500 transition-all"
                        >
                            Xem tất cả tour <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </motion.div>

                <motion.div ref={ref} className="relative">
                    {/* Nút điều hướng */}
                    {tours.length > itemsPerView && (
                        <>
                            <button
                                onClick={handlePrev}
                                disabled={isTransitioning}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center text-gray-700 hover:text-cyan-600 transition-all hover:bg-cyan-50 disabled:opacity-50"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={isTransitioning}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center text-gray-700 hover:text-cyan-600 transition-all hover:bg-cyan-50 disabled:opacity-50"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {visibleTours.map((tour) => (
                            <motion.div
                                key={tour.tourId}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                onMouseEnter={() => setExpandedCard(tour.tourId)}
                                onMouseLeave={() => setExpandedCard(null)}
                                className="group relative h-96 md:h-[520px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
                            >
                                {/* Ảnh nền */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${tour.imageUrl || '/images/placeholder-tour.jpg'})` }}
                                />

                                {/* Overlay */}
                                <div className={`absolute inset-0 bg-black/50 transition-all duration-500 ${expandedCard === tour.tourId ? 'bg-black/70' : ''}`} />

                                {/* Badge (nếu muốn thêm sau) */}
                                {tour.popularityScore > 90 && (
                                    <div className="absolute top-4 left-4 z-20">
                                        <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                            HOT
                                        </span>
                                    </div>
                                )}

                                {/* Nội dung mặc định */}
                                <div className={`absolute bottom-0 left-0 right-0 p-6 text-white transition-all duration-500 ${expandedCard === tour.tourId ? 'opacity-0' : 'opacity-100'}`}>
                                    <h3 className="text-2xl md:text-3xl font-bold line-clamp-2">{tour.tourName}</h3>
                                    <div className="flex items-center gap-2 mt-2 text-sm opacity-90">
                                        <MapPin className="w-4 h-4" />
                                        <span>{tour.destinationName}</span>
                                    </div>
                                </div>

                                {/* Nội dung khi hover */}
                                <div className={`absolute inset-0 p-6 flex flex-col justify-end text-white transition-all duration-500 ${expandedCard === tour.tourId ? 'opacity-100' : 'opacity-0'}`}>
                                    <h3 className="text-2xl md:text-3xl font-bold mb-3 line-clamp-2">{tour.tourName}</h3>
                                    <p className="text-sm opacity-90 mb-4 line-clamp-2">{tour.description || tour.destinationName}</p>

                                    <div className="flex items-center gap-6 text-sm mb-6">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                            <span>{tour.averageRating.toFixed(1)} ({tour.reviewsCount} đánh giá)</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{tour.bookingsCount} đã đặt</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-xs opacity-80">Điểm phổ biến</p>
                                            <p className="text-2xl font-bold text-cyan-400">{tour.popularityScore.toFixed(0)}</p>
                                        </div>

                                        {/* NÚT ĐẶT NGAY → CHI TIẾT TOUR */}
                                        <button
                                            onClick={() => navigate(`/tour/${tour.tourId}`)}
                                            className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-full font-bold transition-all hover:scale-105 shadow-lg"
                                        >
                                            Đặt ngay
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Dots */}
                    {tours.length > itemsPerView && (
                        <div className="flex justify-center gap-3 mt-12">
                            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`transition-all rounded-full ${i === currentIndex ? 'bg-cyan-500 w-10 h-3' : 'bg-gray-300 w-3 h-3 hover:bg-gray-400'}`}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default PopularTours;