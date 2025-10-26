import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Destination {
    id: string;
    name: string;
    region: 'Bắc' | 'Trung' | 'Nam';
    description: string;
    imageUrl: string;
    toursCount: number;
    status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
}

interface DestinationCardProps {
    destination: Destination;
    index: number;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleViewTours = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isLoading) return;

        setIsLoading(true);

        try {
            // Delay để animation hoàn thành trước khi chuyển hướng
            setTimeout(() => {
                navigate(`/tours?destinationId=${destination.id}`, {
                    state: {
                        destinationName: destination.name,
                        destinationImage: destination.imageUrl
                    }
                });
            }, 150);
        } catch (error) {
            console.error('Error navigating to tours:', error);
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative overflow-hidden rounded-2xl h-96 cursor-pointer group transition-shadow duration-500"
            onMouseEnter={() => !isLoading && setIsHovered(true)}
            onMouseLeave={() => !isLoading && setIsHovered(false)}
        >
            {/* Background Image */}
            <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.3) 100%), url("${destination.imageUrl || 'https://via.placeholder.com/800x600'}")`,
                }}
                animate={{
                    scale: isHovered ? 1.05 : 1,
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
            />

            {/* Overlay Gradient */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                animate={{
                    opacity: isHovered ? 0.9 : 1,
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Tours Count Badge */}
            <motion.div
                className="absolute top-4 right-4 z-10"
                initial={{ scale: 1 }}
                animate={{
                    scale: isHovered ? 1.05 : 1,
                    y: isHovered ? -2 : 0,
                }}
                transition={{ duration: 0.2 }}
            >
                <motion.span
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-sm shadow-lg"
                    whileHover={{ scale: 1.05 }}
                >
                    {destination.toursCount} tour
                </motion.span>
            </motion.div>

            {/* Hover Content */}
            <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                <motion.h3
                    className="text-3xl font-bold text-white mb-3 drop-shadow-lg"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{
                        y: isHovered ? 0 : 20,
                        opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    {destination.name}
                </motion.h3>
                <motion.p
                    className="text-gray-100 text-sm mb-6 max-w-md leading-relaxed drop-shadow-md"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{
                        y: isHovered ? 0 : 20,
                        opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                >
                    {destination.description}
                </motion.p>
                <motion.button
                    className="relative bg-white/90 hover:bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold uppercase text-sm tracking-wide overflow-hidden group/btn shadow-lg backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{
                        y: isHovered ? 0 : 20,
                        opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    whileHover={{
                        scale: 1.05,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                        backgroundColor: '#f8fafc'
                    }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoading}
                    onClick={handleViewTours}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Đang chuyển...
                            </>
                        ) : (
                            'Xem Tất Cả Tour'
                        )}
                    </span>
                    {!isLoading && (
                        <>
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg"
                                initial={{ x: '-100%' }}
                                whileHover={{ x: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 z-20 font-semibold">
                                Khám Phá Ngay
                            </span>
                        </>
                    )}
                </motion.button>
            </motion.div>

            {/* Default Content */}
            <motion.div
                className="absolute inset-0 flex flex-col justify-end p-6 z-5"
                initial={{ opacity: 1 }}
                animate={{
                    opacity: isHovered ? 0 : 1,
                }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                    initial={{ y: 0 }}
                    animate={{
                        y: isHovered ? 20 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <h3 className="text-3xl font-bold text-white drop-shadow-lg">{destination.name}</h3>
                    <p className="text-white/80 text-sm mt-1">Khám phá {destination.region}</p>
                </motion.div>
            </motion.div>

            {/* Border Animation */}
            <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{
                    opacity: isHovered ? 1 : 0,
                    pathLength: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                style={{
                    background: 'linear-gradient(45deg, rgba(6, 182, 212, 0.8), rgba(147, 51, 234, 0.8))',
                    padding: '2px',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                }}
            />
        </motion.div>
    );
};

export default DestinationCard;