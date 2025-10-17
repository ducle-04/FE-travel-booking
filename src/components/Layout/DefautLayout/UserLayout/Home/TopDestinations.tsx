import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import React, { useState, useRef } from 'react';

interface Destination {
    id: number;
    name: string;
    tours: number;
    description: string;
    image: string;
}

interface CustomVariants {
    [key: string]: any; // Tạm thời dùng 'any' để tránh lỗi, có thể thay bằng kiểu cụ thể hơn nếu cần
}

const TopDestinations: React.FC = () => {
    const [expandedCard, setExpandedCard] = useState<number | null>(null);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const destinations: Destination[] = [
        {
            id: 1,
            name: 'Tây Âu',
            tours: 3,
            description:
                'Khám phá vẻ quyến rũ của các thành phố lịch sử, địa danh nổi tiếng và bảo tàng hàng đầu trên những điểm đến yêu thích nhất của Châu Âu.',
            image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=600&fit=crop',
        },
        {
            id: 2,
            name: 'Nam Phi',
            tours: 2,
            description:
                'Trải nghiệm vẻ đẹp hoang sơ của cảnh quan Châu Phi, động vật hoang dã đa dạng và cảnh sắc ven biển tuyệt đẹp.',
            image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop',
        },
        {
            id: 3,
            name: 'Scandinavia',
            tours: 2,
            description:
                'Khám phá các vịnh hẹp bí ẩn, ánh sáng phương Bắc và vẻ đẹp tối giản của các nước Bắc Âu.',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        },
        {
            id: 4,
            name: 'Ai Cập',
            tours: 3,
            description:
                'Hành trình qua lịch sử cổ đại, kim tự tháp hùng vĩ và những kỳ quan bất tận của sông Nile.',
            image: 'https://images.unsplash.com/photo-1505826759037-406b40feb4cd?w=800&h=600&fit=crop',
        },
        {
            id: 5,
            name: 'Châu Á',
            tours: 5,
            description:
                'Ngập chìm trong các nền văn hóa sôi động, đền thờ cổ kính và cảnh quan núi non hùng vĩ.',
            image: 'https://images.unsplash.com/photo-1528164344705-483b23c0a4dd?w=800&h=600&fit=crop',
        },
        {
            id: 6,
            name: 'Châu Mỹ',
            tours: 4,
            description:
                'Từ những thành phố nhộn nhịp đến các kỳ quan thiên nhiên, trải nghiệm sự đa dạng của lục địa Mỹ.',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        },
    ];

    const handleMouseEnter = (id: number): void => {
        setExpandedCard(id);
    };

    const handleMouseLeave = (): void => {
        setExpandedCard(null);
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
        hover: { scale: 1.1 },
    };

    const overlayVariants: CustomVariants = {
        initial: { background: 'rgba(0, 0, 0, 0.4)' },
        hover: { background: 'rgba(0, 0, 0, 0.6)' },
    };

    const contentVariants: CustomVariants = {
        initial: { opacity: 1 },
        hidden: { opacity: 0 },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-16 px-4 sm:px-6 lg:px-8">
            {/* Tiêu đề */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.4, 2, 0.6, 1] }}
                className="max-w-7xl mx-auto text-center mb-16"
            >
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                    Điểm Đến <span className="text-teal-500">Hàng Đầu</span>
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                    Khám phá các điểm đến hàng đầu được bình chọn bởi hơn 100,000+ khách hàng trên toàn thế giới.
                </p>
                <motion.button
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                    className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 font-semibold border-b-2 border-gray-400 hover:border-teal-500 hover:text-teal-500"
                >
                    Tất Cả Điểm Đến <ArrowRight className="w-5 h-5" />
                </motion.button>
            </motion.div>

            {/* Lưới Điểm Đến */}
            <div ref={ref} className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((dest: Destination, index: number) => (
                    <motion.div
                        key={dest.id}
                        custom={index}
                        variants={cardVariants}
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                        className="relative h-80 rounded-2xl overflow-hidden cursor-pointer"
                        onMouseEnter={() => handleMouseEnter(dest.id)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Hình nền */}
                        <motion.div
                            variants={imageVariants}
                            initial="initial"
                            animate={expandedCard === dest.id ? 'hover' : 'initial'}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0"
                            style={{ backgroundImage: `url(${dest.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        ></motion.div>

                        {/* Lớp phủ */}
                        <motion.div
                            variants={overlayVariants}
                            initial="initial"
                            animate={expandedCard === dest.id ? 'hover' : 'initial'}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0"
                        ></motion.div>

                        {/* Nội dung - Trạng thái Ban đầu */}
                        <motion.div
                            variants={contentVariants}
                            initial="initial"
                            animate={expandedCard === dest.id ? 'hidden' : 'initial'}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 flex flex-col justify-between p-6"
                        >
                            <div className="flex justify-end">
                                <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    {dest.tours} tour
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold text-white">{dest.name}</h2>
                        </motion.div>

                        {/* Nội dung - Trạng thái Mở rộng */}
                        <motion.div
                            variants={contentVariants}
                            initial="hidden"
                            animate={expandedCard === dest.id ? 'initial' : 'hidden'}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 flex flex-col justify-between p-6"
                        >
                            <div className="flex justify-between items-start">
                                <h2 className="text-3xl font-bold text-white flex-1">{dest.name}</h2>
                                <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-4">
                                    {dest.tours} tour
                                </span>
                            </div>
                            <div className="space-y-4">
                                <p className="text-white/90 text-sm leading-relaxed line-clamp-3">{dest.description}</p>
                                <motion.button
                                    whileHover={{ x: 5 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-teal-500 hover:text-teal-400 font-semibold text-sm flex items-center gap-2"
                                >
                                    Xem tất cả tour <ArrowRight className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default TopDestinations;