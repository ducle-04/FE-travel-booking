import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // 🔥 Thêm dòng này

interface CustomVariants {
    [key: string]: any;
}

const ExploreSection: React.FC = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const navigate = useNavigate(); // 🔥 hook chuyển trang

    const headerVariants: CustomVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 2, 0.6, 1] } },
    };

    const imageVariants: CustomVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (index: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: index * 0.2, duration: 0.6, ease: [0.4, 2, 0.6, 1] },
        }),
        hover: { scale: 1.05, transition: { duration: 0.3 } },
    };

    const contentVariants: CustomVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.4, ease: [0.4, 2, 0.6, 1] } },
    };

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-slate-50 to-slate-100">
            <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="grid grid-cols-2 gap-4">
                    <motion.img
                        src="https://res.cloudinary.com/duagb2yln/image/upload/v1765112377/destinations/gbeuxdk7ckvpkbty0pyc.jpg"
                        alt="Đền"
                        className="rounded-3xl w-full h-80 object-cover"
                        custom={0}
                        variants={imageVariants}
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                        whileHover="hover"
                        loading="lazy"
                    />
                    <motion.img
                        src="https://res.cloudinary.com/duagb2yln/image/upload/v1765112674/destinations/mpb53w4r8pip6szpafqt.webp"
                        alt="Bãi biển"
                        className="rounded-3xl w-full h-80 object-cover mt-8"
                        custom={1}
                        variants={imageVariants}
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                        whileHover="hover"
                        loading="lazy"
                    />
                </div>

                <div>
                    <motion.div
                        variants={headerVariants}
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                        className="mb-8"
                    >
                        <span className="text-cyan-500 font-semibold text-sm">KHÁM PHÁ CÙNG CHÚNG TÔI</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2 mb-4">
                            Khám Phá Tất Cả Các Góc <span className="text-cyan-500">Thế Giới</span> Cùng Chúng Tôi
                        </h2>
                        <p className="text-gray-600">
                            Chúng tôi cung cấp nhiều gói dịch vụ và ưu đãi du lịch hấp dẫn. Cam kết mang đến trải nghiệm tốt nhất với đội ngũ chuyên gia luôn sẵn sàng hỗ trợ bạn.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={contentVariants}
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                    >
                        <motion.button
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.3 }}
                            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-800 text-white font-semibold rounded-lg transition duration-300"
                            onClick={() => navigate("/about")}   // 🔥 Chuyển trang tại đây
                        >
                            Khám Phá Thêm
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ExploreSection;
