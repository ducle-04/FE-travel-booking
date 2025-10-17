import { ChevronLeft, ChevronRight, MapPin, Calendar, Star } from 'lucide-react';
import React, { useState } from 'react';

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

const PopularTours: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [expandedCard, setExpandedCard] = useState<number | null>(null);

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
    const maxIndex: number = Math.ceil(tours.length / itemsPerView) - 1;

    const handleNext = (): void => {
        setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    };

    const handlePrev = (): void => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
    };

    const handleMouseEnter = (id: number): void => {
        setExpandedCard(id);
    };

    const handleMouseLeave = (): void => {
        setExpandedCard(null);
    };

    const visibleTours: Tour[] = tours.slice(
        currentIndex * itemsPerView,
        currentIndex * itemsPerView + itemsPerView
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-16 px-4 sm:px-6 lg:px-8">
            {/* Tiêu đề */}
            <div className="max-w-7xl mx-auto text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                    Tour <span className="text-teal-500">Phổ Biến</span>
                </h1>
            </div>

            {/* Carousel Container */}
            <div className="max-w-7xl mx-auto relative">
                {/* Navigation Buttons */}
                <button
                    onClick={handlePrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center text-gray-700 hover:text-teal-500 transition-all duration-300 hover:bg-teal-50"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                    onClick={handleNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center text-gray-700 hover:text-teal-500 transition-all duration-300 hover:bg-teal-50"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Tours Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                    {visibleTours.map((tour: Tour, idx: number) => (
                        <div
                            key={tour.id}
                            className="group relative h-[480px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500"
                            onMouseEnter={() => handleMouseEnter(tour.id)}
                            onMouseLeave={handleMouseLeave}
                            style={{
                                animation: `slideIn 0.5s ease-out ${idx * 0.1}s both`,
                            }}
                        >
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
                            `}</style>

                            {/* Background Image */}
                            <div
                                className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url(${tour.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                            ></div>

                            {/* Overlay */}
                            <div
                                className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${expandedCard === tour.id ? 'bg-black/60' : ''}`}
                            ></div>

                            {/* Badge */}
                            {tour.badge && (
                                <div className="absolute top-4 right-4 z-20">
                                    <span className="bg-teal-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
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
                                <div></div> {/* Spacer trên */}
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
                                        <span className="bg-teal-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg ml-4 whitespace-nowrap">
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
                                    <button className="text-teal-500 hover:text-teal-400 font-semibold text-sm transition-colors duration-300 flex items-center gap-2">
                                        Xem Chi Tiết <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Bottom Row - Price and Book */}
                                <div className="flex justify-between items-center pt-4 border-t border-white/20">
                                    <div>
                                        <p className="text-xs text-white/70 mb-1">Bắt đầu từ</p>
                                        <p className="text-2xl font-bold text-teal-300">
                                            {tour.price}
                                        </p>
                                    </div>
                                    <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                                        Đặt Ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mt-12">
                    {[...Array(Math.ceil(tours.length / itemsPerView))].map(
                        (_: any, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentIndex
                                    ? 'bg-teal-500 w-8'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default PopularTours;