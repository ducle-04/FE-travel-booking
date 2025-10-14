import React, { useState } from 'react';
import { MapPin, Calendar, Users } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import background1 from '../../../../../assets/images/background/background1.jpg'
import background2 from '../../../../../assets/images/background/background2.jpg'
import background3 from '../../../../../assets/images/background/background3.jpg'
const Banner: React.FC = () => {
    const [location, setLocation] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [travelers, setTravelers] = useState('');

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false, // Ẩn nút điều hướng
    };

    const images = [
        background1,
        background2,
        background3,
    ];

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Slider Background */}
            <Slider {...sliderSettings} className="absolute inset-0">
                {images.map((image, index) => (
                    <div key={index} className="h-screen">
                        <img
                            src={image}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </Slider>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>

            {/* Banner Content */}
            <div className="relative min-h-screen flex items-center justify-center px-4 pt-16">
                <div className="text-center text-white max-w-2xl">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                        Tận hưởng kỳ nghỉ <br /> cùng WonderTrail
                    </h1>
                    <p className="text-lg md:text-xl mb-8 text-gray-200">
                        Du lịch là hành trình khám phá những vùng đất mới, văn hóa mới và những trải nghiệm đáng nhớ.
                        Bạn có thể di chuyển bằng máy bay, tàu hỏa, ô tô, xe máy hay thậm chí là phượt bộ.
                    </p>

                    {/* Search Box */}
                    <div className="bg-white bg-opacity-95 rounded-lg p-6 md:p-8 shadow-lg">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Location */}
                            <div className="flex flex-col">
                                <label className="text-gray-700 text-sm font-semibold mb-2">Địa điểm</label>
                                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                                    <MapPin size={18} className="text-gray-500 mr-2" />
                                    <input
                                        type="text"
                                        placeholder="Bạn muốn đi đâu?"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full outline-none text-gray-700"
                                    />
                                </div>
                            </div>

                            {/* Check In */}
                            <div className="flex flex-col">
                                <label className="text-gray-700 text-sm font-semibold mb-2">Ngày khởi hành</label>
                                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                                    <Calendar size={18} className="text-gray-500 mr-2" />
                                    <input
                                        type="date"
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                        className="w-full outline-none text-gray-700"
                                    />
                                </div>
                            </div>

                            {/* Travelers */}
                            <div className="flex flex-col">
                                <label className="text-gray-700 text-sm font-semibold mb-2">Số người</label>
                                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                                    <Users size={18} className="text-gray-500 mr-2" />
                                    <select
                                        value={travelers}
                                        onChange={(e) => setTravelers(e.target.value)}
                                        className="w-full outline-none text-gray-700"
                                    >
                                        <option value="">Chọn số người</option>
                                        <option value="1">1 người</option>
                                        <option value="2">2 người</option>
                                        <option value="3">3 người</option>
                                        <option value="4">4+ người</option>
                                    </select>
                                </div>
                            </div>

                            {/* Button */}
                            <div className="flex items-end">
                                <button className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3 rounded-lg transition">
                                    Tìm kiếm ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;
