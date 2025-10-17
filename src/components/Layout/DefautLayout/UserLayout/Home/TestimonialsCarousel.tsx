import { Star } from 'lucide-react';
import React, { useState } from 'react';

interface Testimonial {
    id: number;
    name: string;
    location: string;
    image: string;
    rating: number;
    text: string;
}

interface TestimonialsCarouselProps { }

const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const testimonials: Testimonial[] = [
        {
            id: 1,
            name: 'Brittany Clark',
            location: 'San Francisco',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
            rating: 5,
            text: 'Các tour trên trang web này thật tuyệt vời. Tôi đã thực sự tận hưởng cùng gia đình! Đội ngũ rất chuyên nghiệp và chăm sóc khách hàng chu đáo. Chắc chắn sẽ giới thiệu bạn bè tham gia công ty này!',
        },
        {
            id: 2,
            name: 'Frances Hill',
            location: 'San Francisco',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
            rating: 5,
            text: 'Các tour trên trang web này thật tuyệt vời. Tôi đã thực sự tận hưởng cùng gia đình! Đội ngũ rất chuyên nghiệp và chăm sóc khách hàng chu đáo. Chắc chắn sẽ giới thiệu bạn bè tham gia công ty này!',
        },
        {
            id: 3,
            name: 'John Smith',
            location: 'Los Angeles',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
            rating: 5,
            text: 'Trải nghiệm tuyệt vời! Các hướng dẫn viên rất hiểu biết và thân thiện. Mọi thứ được tổ chức tốt và chúng tôi đã có khoảng thời gian tuyệt vời khi khám phá những nơi mới.',
        },
        {
            id: 4,
            name: 'Sarah Johnson',
            location: 'New York',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
            rating: 5,
            text: 'Rất khuyến khích! Sự chú ý đến chi tiết và dịch vụ khách hàng vượt quá mong đợi của chúng tôi. Chắc chắn sẽ đặt tour khác với công ty này.',
        },
    ];

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const getCardPosition = (index: number) => {
        const diff = index - currentIndex;

        if (diff === 0) {
            return 'translate-x-0 scale-110 opacity-100 z-30'; // Card chính luôn phóng to
        } else if (diff === -1) {
            return '-translate-x-[105%] scale-90 opacity-50 z-10'; // Card liền trước (bên trái)
        } else if (diff === 1) {
            return 'translate-x-[105%] scale-90 opacity-50 z-10'; // Card liền sau (bên phải)
        } else {
            return 'translate-x-0 scale-75 opacity-0 z-0'; // Các card khác ẩn
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-16 px-4">
            <div className="max-w-6xl w-full">
                {/* Tiêu đề */}
                <h2 className="text-5xl md:text-6xl font-bold text-center mb-20 text-gray-900 leading-tight px-4">
                    Những gì khách hàng<br />nói về chúng tôi
                </h2>

                {/* Carousel Container */}
                <div className="relative h-96 mb-16">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={testimonial.id}
                                className={`absolute w-full max-w-2xl transition-all duration-500 ease-out ${getCardPosition(index)}`}
                                style={{ pointerEvents: index === currentIndex ? 'auto' : 'none' }}
                            >
                                <div className="bg-white rounded-3xl p-8 md:p-12">
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                        {/* Avatar */}
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover flex-shrink-0"
                                        />

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                                                        {testimonial.name}
                                                    </h3>
                                                    <p className="text-gray-400 text-sm md:text-base">
                                                        {testimonial.location}
                                                    </p>
                                                </div>

                                                {/* Stars */}
                                                <div className="flex gap-1 mt-2 md:mt-0">
                                                    {[...Array(testimonial.rating)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className="w-5 h-5 md:w-6 md:h-6 fill-yellow-400 text-yellow-400"
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Review Text */}
                                            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                                                {testimonial.text}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots Navigation */}
                <div className="flex justify-center gap-3">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'bg-teal-500 w-8'
                                : 'bg-gray-300 w-3'
                                }`}
                            aria-label={`Chuyển đến đánh giá ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestimonialsCarousel;