import { ChevronLeft, ChevronRight, MapPin, Calendar, Star } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Tour {
    id: number;
    title: string;
    location: string;
    duration: string;
    price: string;
    rating: number;
    reviews: number;
    image: string;
    badge: string | null;
}

interface CustomVariants {
    [key: string]: any;
}

const THEME_COLOR = {
    primary: 'cyan-500',
    hover: 'cyan-600',
    light: 'cyan-300',
    accent: 'cyan-400',
};

const PopularTours: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [expandedCard, setExpandedCard] = useState<number | null>(null);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const tours: Tour[] = [
        {
            id: 1,
            title: 'Tour Hai Ngày Moscow 7 Ngày',
            location: 'Moscow, Nga',
            duration: '7 ngày',
            price: '$1,299',
            rating: 4.8,
            reviews: 234,
            image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&h=600&fit=crop',
            badge: null,
        },
        {
            id: 2,
            title: 'Áo – 6 Ngày ở Vienna, Hallstatt',
            location: 'Vienna, Áo',
            duration: '6 ngày',
            price: '$899',
            rating: 4.9,
            reviews: 456,
            image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677c3?w=800&h=600&fit=crop',
            badge: 'Ưu Đãi Đặc Biệt',
        },
        {
            id: 3,
            title: 'Argentina – Chuyến Lặn Tuyệt Vời',
            location: 'Buenos Aires, Argentina',
            duration: '8 ngày',
            price: '$1,599',
            rating: 4.7,
            reviews: 189,
            image: 'https://images.unsplash.com/photo-1589903308904-10138c3c3e6e?w=800&h=600&fit=crop',
            badge: null,
        },
        {
            id: 4,
            title: 'Nhật Bản – Lễ Hội Hoa Anh Đào',
            location: 'Tokyo, Nhật Bản',
            duration: '10 ngày',
            price: '$2,099',
            rating: 5.0,
            reviews: 567,
            image: 'https://images.unsplash.com/photo-1551641506-ee3e31c8f9ab?w=800&h=600&fit=crop',
            badge: 'Ưu Đãi Nóng',
        },
        {
            id: 5,
            title: 'Iceland – Tour Ánh Đèn Phương Bắc',
            location: 'Reykjavik, Iceland',
            duration: '5 ngày',
            price: '$1,199',
            rating: 4.8,
            reviews: 342,
            image: 'https://images.unsplash.com/photo-1501436513145-30f24e7f6086?w=800&h=600&fit=crop',
            badge: null,
        },
        {
            id: 6,
            title: 'Hy Lạp – Hành Trình Đảo Nhảy',
            location: 'Santorini, Hy Lạp',
            duration: '7 ngày',
            price: '$1,399',
            rating: 4.9,
            reviews: 423,
            image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69e99d8?w=800&h=600&fit=crop',
            badge: 'Thời Hạn Có Giới Hạn',
        },
    ];

    const itemsPerView: number = 3;
    const maxIndex: number = tours.length - itemsPerView;

    const handleNext = (): void => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
            setTimeout(() => setIsTransitioning(false), 500);
        }
    };

    const handlePrev = (): void => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
            setTimeout(() => setIsTransitioning(false), 500);
        }
    };

    const handleMouseEnter = (id: number): void => {
        setExpandedCard(id);
    };

    const handleMouseLeave = (): void => {
        setExpandedCard(null);
    };

    const visibleTours: Tour[] = tours.slice(
        currentIndex,
        currentIndex + itemsPerView
    );

    const containerVariants: CustomVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.4, 2, 0.6, 1],
                when: 'beforeChildren',
                staggerChildren: 0.2,
            },
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-16 px-4 sm:px-6 lg:px-8">
            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slideOutLeft {
                    from {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(-100px);
                    }
                }

                .tour-card {
                    animation: slideInRight 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }

                .tour-card-exit {
                    animation: slideOutLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
            `}</style>

            {/* Tiêu đề */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.4, 2, 0.6, 1] }}
                className="max-w-7xl mx-auto text-center mb-12"
            >
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                    Tour <span className={`text-${THEME_COLOR.primary}`}>Phổ Biến</span>
                </h1>
            </motion.div>

            {/* Carousel Container */}
            <motion.div
                ref={ref}
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="max-w-7xl mx-auto relative"
            >
                {/* Navigation Buttons */}
                <button
                    onClick={handlePrev}
                    disabled={isTransitioning}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center text-gray-700 hover:text-cyan-600 transition-all duration-300 hover:bg-cyan-100 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                    onClick={handleNext}
                    disabled={isTransitioning}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center text-gray-700 hover:text-cyan-600 transition-all duration-300 hover:bg-cyan-100 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Tours Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 overflow-hidden">
                    {visibleTours.map((tour: Tour) => (
                        <div
                            key={tour.id}
                            className="group relative h-[480px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 tour-card"
                            onMouseEnter={() => handleMouseEnter(tour.id)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105"
                                style={{
                                    backgroundImage: `url(${tour.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            ></div>

                            {/* Overlay */}
                            <div
                                className={`absolute inset-0 bg-black/50 transition-opacity duration-500 ${expandedCard === tour.id ? 'bg-black/70' : ''}`}
                            ></div>

                            {/* Badge */}
                            {tour.badge && (
                                <div className="absolute top-4 right-4 z-20">
                                    <span className={`bg-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg`}>
                                        {tour.badge}
                                    </span>
                                </div>
                            )}

                            {/* Content - Initial State */}
                            <div
                                className={`absolute inset-0 flex flex-col justify-between p-6 transition-all duration-500 ${expandedCard === tour.id
                                    ? 'opacity-0 pointer-events-none'
                                    : 'opacity-100'
                                    }`}
                            >
                                <div></div>
                                <h3 className="text-2xl font-bold text-white mb-4 line-clamp-2">
                                    {tour.title}
                                </h3>
                                <div className="flex flex-wrap gap-4 text-sm text-white/90">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{tour.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{tour.duration}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content - Expanded State */}
                            <div
                                className={`absolute inset-0 flex flex-col justify-end p-6 text-white transition-all duration-500 ${expandedCard === tour.id
                                    ? 'opacity-100'
                                    : 'opacity-0 pointer-events-none'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-bold flex-1 line-clamp-2">
                                        {tour.title}
                                    </h3>
                                    {tour.badge && (
                                        <span className={`bg-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg ml-4 whitespace-nowrap`}>
                                            {tour.badge}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-4 mb-4">
                                    <div className="flex flex-wrap gap-4 text-sm text-white/90">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{tour.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{tour.duration}</span>
                                        </div>
                                    </div>

                                    {/* Rating and Reviews */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            {[...Array(5)].map((_: any, i: number) => (
                                                <Star
                                                    key={i}
                                                    className={`w-5 h-5 ${i < Math.floor(tour.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-white/80">
                                            {tour.rating} ({tour.reviews} đánh giá)
                                        </span>
                                    </div>

                                    {/* View Details Button */}
                                    <button className={`text-cyan-300 hover:text-cyan-400 font-semibold text-sm transition-colors duration-300 flex items-center gap-2`}>
                                        Xem Chi Tiết <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Bottom Row - Price and Book */}
                                <div className="flex justify-between items-center pt-4 border-t border-white/20">
                                    <div>
                                        <p className="text-xs text-white/70 mb-1">Bắt đầu từ</p>
                                        <p className={`text-2xl font-bold text-cyan-300`}>
                                            {tour.price}
                                        </p>
                                    </div>
                                    <button className={`bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105`}>
                                        Đặt Ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mt-12">
                    {[...Array(tours.length - itemsPerView + 1)].map(
                        (_: any, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    if (!isTransitioning) {
                                        setCurrentIndex(idx);
                                    }
                                }}
                                className={`transition-all duration-300 rounded-full ${idx === currentIndex
                                    ? `bg-cyan-500 w-8 h-3`
                                    : 'bg-gray-300 hover:bg-gray-400 w-3 h-3'
                                    }`}
                            />
                        )
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default PopularTours;