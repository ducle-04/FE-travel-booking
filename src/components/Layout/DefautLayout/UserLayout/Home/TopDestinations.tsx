// src/components/home/TopDestinations.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, MapPin, Ticket } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface PopularDestination {
    destinationId: number;
    destinationName: string;
    imageUrl: string;
    region: 'BAC' | 'TRUNG' | 'NAM';
    tourCount: number;
    totalViews: number;
    bookingCount: number;
    description?: string;
}

const regionLabel: Record<string, string> = {
    BAC: 'Miền Bắc',
    TRUNG: 'Miền Trung',
    NAM: 'Miền Nam',
};

const TopDestinations: React.FC = () => {
    const [destinations, setDestinations] = useState<PopularDestination[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedCard, setExpandedCard] = useState<number | null>(null);
    const [navigatingId, setNavigatingId] = useState<number | null>(null); // để hiện loading khi click

    const navigate = useNavigate();
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:8080/api/dashboard/top-destinations');
                setDestinations(res.data);
            } catch (err) {
                console.error('Lỗi load top destinations:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Hàm xử lý khi click "Xem tour"
    // Chỉ thay mỗi hàm này thôi, còn lại giữ nguyên
    const handleViewTours = (dest: PopularDestination) => {
        if (navigatingId === dest.destinationId) return;

        setNavigatingId(dest.destinationId);

        // QUAN TRỌNG: Dùng query string để trang /tours đọc được destinationId
        setTimeout(() => {
            navigate(`/tours?destinationId=${dest.destinationId}`, {
                state: {
                    destinationName: dest.destinationName,
                    destinationImage: dest.imageUrl,
                },
            });
        }, 200);
    };

    if (loading) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
                </div>
            </section>
        );
    }

    if (destinations.length === 0) return null;

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Tiêu đề */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Điểm Đến <span className="text-cyan-500">Hàng Đầu</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                        Khám phá các điểm đến được yêu thích nhất bởi hơn 100.000+ du khách.
                    </p>
                    <motion.div whileHover={{ x: 8 }} className="inline-block">
                        <Link
                            to="/destinations"
                            className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 font-semibold border-b-2 border-gray-400 hover:border-cyan-500 hover:text-cyan-500 transition-all"
                        >
                            Tất Cả Điểm Đến <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Grid */}
                <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {destinations.map((dest, index) => (
                        <motion.div
                            key={dest.destinationId}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, duration: 0.6 }}
                            onMouseEnter={() => setExpandedCard(dest.destinationId)}
                            onMouseLeave={() => setExpandedCard(null)}
                            className="relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-500"
                        >
                            {/* Ảnh nền */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{
                                    backgroundImage: `url(${dest.imageUrl || '/images/placeholder.jpg'})`,
                                }}
                            />

                            {/* Overlay */}
                            <motion.div
                                animate={{
                                    background: expandedCard === dest.destinationId
                                        ? 'rgba(0,0,0,0.65)'
                                        : 'rgba(0,0,0,0.45)'
                                }}
                                className="absolute inset-0"
                            />

                            {/* Badge số tour */}
                            <div className="absolute top-4 right-4 z-10">
                                <span className="bg-cyan-500 text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5">
                                    <Ticket className="w-4 h-4" />
                                    {dest.tourCount} tour
                                </span>
                            </div>

                            {/* Nội dung mặc định */}
                            <div className={`absolute inset-0 flex flex-col justify-end p-6 text-white transition-all duration-300 ${expandedCard === dest.destinationId ? 'opacity-0' : 'opacity-100'}`}>
                                <h2 className="text-3xl font-bold">{dest.destinationName}</h2>
                            </div>

                            {/* Nội dung khi hover + Nút Xem tour */}
                            <div className={`absolute inset-0 flex flex-col justify-between p-6 text-white transition-all duration-300 ${expandedCard === dest.destinationId ? 'opacity-100' : 'opacity-0'}`}>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="w-5 h-5 text-cyan-400" />
                                        <span className="text-sm font-medium">{regionLabel[dest.region]}</span>
                                    </div>
                                    <h2 className="text-3xl font-bold mb-3">{dest.destinationName}</h2>
                                    <p className="text-sm leading-relaxed line-clamp-3 text-white/90">
                                        {dest.description || `Đã có ${dest.bookingCount.toLocaleString()} lượt đặt và ${dest.totalViews.toLocaleString()} lượt xem.`}
                                    </p>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="text-sm">
                                        <span className="font-bold text-cyan-400">{dest.bookingCount.toLocaleString()}</span> đặt •{' '}
                                        <span className="font-bold text-emerald-400">{dest.totalViews.toLocaleString()}</span> xem
                                    </div>

                                    {/* NÚT XEM TOUR – ĐÚNG NHƯ MÀY MUỐN */}
                                    <button
                                        onClick={() => handleViewTours(dest)}
                                        disabled={navigatingId === dest.destinationId}
                                        className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-70"
                                    >
                                        {navigatingId === dest.destinationId ? (
                                            <>Đang chuyển...</>
                                        ) : (
                                            <>
                                                Xem tour <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TopDestinations;