import React, { useState } from 'react';
import { X, Star, MapPin, Hotel, Image as ImageIcon, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HotelDTO {
    id: number;
    name: string;
    address: string;
    starRating: string | number;
    description?: string;
    images: string[];
    videos?: string[];
}

interface UserHotelModalProps {
    isOpen: boolean;
    onClose: () => void;
    hotel: HotelDTO | null;
}

const UserHotelModal: React.FC<UserHotelModalProps> = ({ isOpen, onClose, hotel }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // SỬA: thêm useState

    if (!isOpen || !hotel) return null;

    const starCount = typeof hotel.starRating === 'string' ? parseInt(hotel.starRating) : hotel.starRating;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % hotel.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-3xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="absolute top-0 left-0 right-0 z-20 p-6 bg-gradient-to-b from-black/60 to-transparent text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-3xl font-bold">{hotel.name}</h2>
                                    <div className="flex items-center gap-2 mt-2">
                                        <MapPin size={20} />
                                        <span className="text-lg">{hotel.address}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-3 bg-white/20 backdrop-blur rounded-full hover:bg-white/30 transition"
                                >
                                    <X size={28} />
                                </button>
                            </div>
                        </div>

                        {/* Hero Image - BÂY GIỜ CHẠY NGON */}
                        <div className="relative h-96 bg-gray-900">
                            <img
                                src={hotel.images[currentImageIndex] || 'https://via.placeholder.com/1200x600?text=Hotel+Image'}
                                alt={hotel.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/1200x600?text=No+Image';
                                }}
                            />
                            {hotel.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition z-30"
                                    >
                                        <ChevronLeft size={32} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition z-30"
                                    >
                                        <ChevronRight size={32} />
                                    </button>
                                    {/* Dots indicator */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                                        {hotel.images.map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-2 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-10' : 'bg-white/50 w-2'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(95vh-24rem)]">
                            {/* Star Rating */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={28}
                                            className={i < starCount ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                                        />
                                    ))}
                                </div>
                                <span className="text-2xl font-bold text-gray-800">{starCount} sao</span>
                                <Hotel size={32} className="text-blue-600 ml-2" />
                            </div>

                            {/* Description */}
                            {hotel.description && (
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl">
                                    <h3 className="text-xl font-bold mb-3 text-gray-800">Giới thiệu</h3>
                                    <p className="text-gray-700 leading-relaxed text-lg">{hotel.description}</p>
                                </div>
                            )}

                            {/* Gallery - BẤM ẢNH NHỎ SẼ CHUYỂN LÊN ẢNH TO */}
                            {hotel.images.length > 0 && (
                                <div>
                                    <h3 className="text-2xl font-bold mb-5 flex items-center gap-3">
                                        <ImageIcon className="w-8 h-8 text-blue-600" />
                                        Bộ sưu tập ảnh
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {hotel.images.map((img, i) => (
                                            <motion.div
                                                key={i}
                                                whileHover={{ scale: 1.05 }}
                                                className="cursor-pointer overflow-hidden rounded-xl shadow-lg border-2 border-transparent hover:border-blue-500 transition"
                                                onClick={() => setCurrentImageIndex(i)} // SỬA: bấm là chuyển ảnh to
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Ảnh ${i + 1}`}
                                                    className="w-full h-48 object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = 'https://via.placeholder.com/400?text=No+Image';
                                                    }}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Videos - BÂY GIỜ VIDEO CHẠY NGON */}
                            {hotel.videos && hotel.videos.length > 0 && (
                                <div>
                                    <h3 className="text-2xl font-bold mb-5 flex items-center gap-3">
                                        <Video className="w-8 h-8 text-purple-600" />
                                        Video giới thiệu
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {hotel.videos.map((videoUrl, i) => (
                                            <div key={i} className="relative overflow-hidden rounded-2xl shadow-xl bg-black">
                                                <video
                                                    src={videoUrl}
                                                    controls
                                                    className="w-full h-64 object-cover rounded-2xl"
                                                    preload="metadata"
                                                    onError={() => console.log('Video load error:', videoUrl)}
                                                >
                                                    Trình duyệt không hỗ trợ video.
                                                </video>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UserHotelModal;