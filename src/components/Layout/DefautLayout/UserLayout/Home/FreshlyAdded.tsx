import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface LatestTour {
    tourId: number;
    tourName: string;
    imageUrl: string;
    description?: string;
    destinationName: string;
    createdAt: string;
    status: "ACTIVE" | "INACTIVE" | "DELETED";
}

const FreshlyAdded: React.FC = () => {
    const [tours, setTours] = useState<LatestTour[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    const navigate = useNavigate();
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const itemsPerView = 5;
    const maxIndex = Math.max(0, Math.ceil((tours.length || 0) / itemsPerView) - 1);

    useEffect(() => {
        const fetchLatestTours = async () => {
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:8080/api/dashboard/latest-tours?limit=10');
                const activeTours = res.data.filter((tour: LatestTour) => tour.status === "ACTIVE");
                setTours(activeTours);
            } catch (err) {
                console.error('Lỗi tải tour mới nhất:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestTours();
    }, []);

    const handleNext = () => setCurrentIndex(prev => prev < maxIndex ? prev + 1 : 0);
    const handlePrev = () => setCurrentIndex(prev => prev > 0 ? prev - 1 : maxIndex);

    const visibleTours = tours.slice(
        currentIndex * itemsPerView,
        (currentIndex + 1) * itemsPerView
    );

    const formatTime = (date: string) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
    };

    if (loading) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600">Đang tải tour mới nhất...</p>
                </div>
            </section>
        );
    }

    if (tours.length === 0) return null;

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Tiêu đề */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-5xl md:text-6xl font-bold mb-6">
                        Tour <span className="text-cyan-500">Mới Thêm</span>
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Những hành trình vừa được cập nhật – khám phá ngay hôm nay!
                    </p>
                    <motion.div whileHover={{ x: 8 }}>
                        <Link
                            to="/tours"
                            className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 font-semibold border-b-2 border-gray-400 hover:border-cyan-500 hover:text-cyan-500 transition-all"
                        >
                            Xem tất cả tour mới <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </motion.div>

                <motion.div ref={ref} className="relative">
                    {/* Nút điều hướng */}
                    {tours.length > itemsPerView && (
                        <>
                            <button
                                onClick={handlePrev}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center text-gray-600 hover:text-cyan-600 transition-all hover:bg-cyan-50"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center text-gray-600 hover:text-cyan-600 transition-all hover:bg-cyan-50"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Grid tour */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {visibleTours.map((tour, idx) => (
                            <motion.div
                                key={tour.tourId}
                                custom={idx}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15, duration: 0.6 }}
                                onClick={() => navigate(`/tour/${tour.tourId}`)}
                                className="group cursor-pointer"
                            >
                                <div className="rounded-2xl overflow-hidden bg-white shadow-md h-96 flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                                    {/* Ảnh */}
                                    <div className="relative h-52 overflow-hidden">
                                        <img
                                            src={tour.imageUrl || '/images/placeholder-tour.jpg'}
                                            alt={tour.tourName}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                            MỚI
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    {/* Nội dung */}
                                    <div className="p-5 flex flex-col justify-between flex-1">
                                        <div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                                <Clock className="w-4 h-4 text-cyan-500" />
                                                <span>{formatTime(tour.createdAt)}</span>
                                            </div>

                                            <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-cyan-600 transition">
                                                {tour.tourName}
                                            </h3>

                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                                <MapPin className="w-4 h-4 text-cyan-500" />
                                                <span className="line-clamp-1">{tour.destinationName}</span>
                                            </div>

                                            {tour.description && (
                                                <p className="text-xs text-gray-600 line-clamp-2">
                                                    {tour.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-4 flex justify-end">
                                            <span className="text-cyan-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                                Xem chi tiết <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>
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
                                    className={`transition-all rounded-full ${i === currentIndex ? 'bg-cyan-500 w-10 h-3' : 'bg-gray-300 w-3 h-3 hover:bg-gray-500'}`}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default FreshlyAdded;