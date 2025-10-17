import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface TourCard {
    id: number;
    title: string;
    badge: string | null;
    rating: number;
    reviews: number;
    originalPrice?: string;
    price: string;
    image: string;
}

interface CustomVariants {
    [key: string]: any;
}

const FreshlyAdded: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const tours: TourCard[] = [
        {
            id: 1,
            title: 'Tour Paris 6 Ngày',
            badge: null,
            rating: 4.0,
            reviews: 2,
            originalPrice: '$2,700',
            price: '$2,000',
            image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=600&fit=crop',
        },
        {
            id: 2,
            title: 'Tour Honolulu 5 Ngày',
            badge: null,
            rating: 5.0,
            reviews: 1,
            price: '$1,500',
            image: 'https://images.unsplash.com/photo-1516832970803-325f3fb9d0e9?w=800&h=600&fit=crop',
        },
        {
            id: 3,
            title: 'Lặn Biển Molokini',
            badge: null,
            rating: 0,
            reviews: 0,
            price: '$80',
            image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop',
        },
        {
            id: 4,
            title: 'Tour Moscow 7 Ngày',
            badge: 'Bán Chạy Nhất',
            rating: 5.0,
            reviews: 0,
            originalPrice: '$3,880',
            price: '$3,500',
            image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&h=600&fit=crop',
        },
        {
            id: 5,
            title: 'Tour Paisley 3 Ngày',
            badge: null,
            rating: 3.5,
            reviews: 12,
            price: '$950',
            image: 'https://images.unsplash.com/photo-1533309902066-3c4f0ca756b6?w=800&h=600&fit=crop',
        },
        {
            id: 6,
            title: 'Tokyo Hoa Anh Đào',
            badge: null,
            rating: 4.8,
            reviews: 45,
            originalPrice: '$2,500',
            price: '$1,899',
            image: 'https://images.unsplash.com/photo-1551641506-ee3e31c8f9ab?w=800&h=600&fit=crop',
        },
        {
            id: 7,
            title: 'Tokyo Hoa Anh Đào',
            badge: null,
            rating: 4.8,
            reviews: 45,
            originalPrice: '$2,500',
            price: '$1,899',
            image: 'https://images.unsplash.com/photo-1551641506-ee3e31c8f9ab?w=800&h=600&fit=crop',
        },
        {
            id: 8,
            title: 'Tokyo Hoa Anh Đào',
            badge: null,
            rating: 4.8,
            reviews: 45,
            originalPrice: '$2,500',
            price: '$1,899',
            image: 'https://images.unsplash.com/photo-1551641506-ee3e31c8f9ab?w=800&h=600&fit=crop',
        },
        {
            id: 9,
            title: 'Tokyo Hoa Anh Đào',
            badge: null,
            rating: 4.8,
            reviews: 45,
            originalPrice: '$2,500',
            price: '$1,899',
            image: 'https://images.unsplash.com/photo-1551641506-ee3e31c8f9ab?w=800&h=600&fit=crop',
        },
    ];

    const itemsPerView: number = 5;
    const maxIndex: number = Math.max(0, Math.ceil(tours.length / itemsPerView) - 1);

    const handleNext = (): void => {
        setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    };

    const handlePrev = (): void => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
    };

    const visibleTours: TourCard[] = tours.slice(
        currentIndex * itemsPerView,
        Math.min((currentIndex + 1) * itemsPerView, tours.length)
    );

    const headerVariants: CustomVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 2, 0.6, 1] } },
    };

    const cardVariants: CustomVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (index: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: index * 0.2,
                duration: 0.6,
                ease: [0.4, 2, 0.6, 1],
            },
        }),
    };

    const imageVariants: CustomVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.1, transition: { duration: 0.5 } },
    };

    const overlayVariants: CustomVariants = {
        initial: { background: 'rgba(0, 0, 0, 0.2)' },
        hover: { background: 'rgba(0, 0, 0, 0.3)', transition: { duration: 0.5 } },
    };

    const renderStars = (rating: number, reviews: number): React.ReactNode => {
        if (rating === 0) return <div className="h-5"></div>;
        return (
            <div className="flex items-center gap-1">
                <div className="flex">
                    {[...Array(5)].map((_: any, i: number) => (
                        <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < Math.floor(rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : i < rating
                                    ? 'fill-yellow-400 text-yellow-400 opacity-50'
                                    : 'text-gray-300'
                                }`}
                        />
                    ))}
                </div>
                <span className="text-xs text-gray-600">({reviews})</span>
            </div>
        );
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 py-16 px-4 sm:px-6 lg:px-8">
            {/* Tiêu đề */}
            <motion.div
                variants={headerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="max-w-7xl mx-auto text-center mb-12"
            >
                <h1 className="text-5xl md:text-6xl font-bold mb-2">
                    Mới <span className="text-cyan-500">Thêm</span>
                </h1>
            </motion.div>

            {/* Carousel Container */}
            <div ref={ref} className="max-w-7xl mx-auto relative">
                {/* Navigation Buttons */}
                <button
                    onClick={handlePrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center text-gray-400 hover:text-cyan-500 transition-all duration-300 hover:bg-cyan-50"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center text-gray-400 hover:text-cyan-500 transition-all duration-300 hover:bg-cyan-50"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Tours Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
                    {visibleTours.map((tour: TourCard, idx: number) => (
                        <motion.div
                            key={tour.id}
                            custom={idx}
                            variants={cardVariants}
                            initial="hidden"
                            animate={isInView ? 'visible' : 'hidden'}
                            className="group cursor-pointer"
                        >
                            {/* Card Container */}
                            <div className="rounded-2xl overflow-hidden bg-white shadow-md h-[360px] flex flex-col transition-all duration-300 hover:shadow-xl">
                                {/* Image */}
                                <motion.div
                                    variants={imageVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    className="relative h-48 overflow-hidden"
                                >
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            backgroundImage: `url(${tour.image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    ></div>
                                    <motion.div
                                        variants={overlayVariants}
                                        initial="initial"
                                        whileHover="hover"
                                        className="absolute inset-0"
                                    ></motion.div>

                                    {/* Badge */}
                                    {tour.badge && (
                                        <motion.div
                                            variants={cardVariants}
                                            custom={idx}
                                            initial="hidden"
                                            animate={isInView ? 'visible' : 'hidden'}
                                            className="absolute top-3 right-3 z-10"
                                        >
                                            <span className="bg-cyan-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                                {tour.badge}
                                            </span>
                                        </motion.div>
                                    )}
                                </motion.div>

                                {/* Content */}
                                <div className="p-4 flex flex-col justify-between flex-1">
                                    <div>
                                        <motion.h3
                                            whileHover={{ x: 5 }}
                                            transition={{ duration: 0.3 }}
                                            className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-cyan-600 transition-colors duration-300"
                                        >
                                            {tour.title}
                                        </motion.h3>
                                        {renderStars(tour.rating, tour.reviews)}
                                    </div>
                                    <div className="space-y-1">
                                        {tour.originalPrice && (
                                            <p className="text-xs text-gray-400 line-through">
                                                {tour.originalPrice}
                                            </p>
                                        )}
                                        <p className="text-lg font-bold text-cyan-600">
                                            {tour.price}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mt-12">
                    {[...Array(Math.ceil(tours.length / itemsPerView))].map(
                        (_: any, idx: number) => (
                            <motion.button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                whileHover={{ scale: 1.2 }}
                                transition={{ duration: 0.3 }}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-cyan-500 w-8' : 'bg-gray-300 hover:bg-gray-400'}`}
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default FreshlyAdded;