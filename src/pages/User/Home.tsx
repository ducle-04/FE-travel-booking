import React from "react";
import Banner from "../../components/Layout/DefautLayout/UserLayout/Banner/Banner";
import TopDestinations from "../../components/Layout/DefautLayout/UserLayout/Home/TopDestinations";
import PopularTours from "../../components/Layout/DefautLayout/UserLayout/Home/PopularTours";
import FreshlyAdded from "../../components/Layout/DefautLayout/UserLayout/Home/FreshlyAdded";
import TravelDealsPage from "../../components/Layout/DefautLayout/UserLayout/Home/TravelDealsPage";
import TestimonialsCarousel from "../../components/Layout/DefautLayout/UserLayout/Home/TestimonialsCarousel";
import ScrollToTop from "../../components/OtherComponent/ScrollToTop"; // Điều chỉnh đường dẫn

interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
    color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color }) => {
    return (
        <div className="flex items-start space-x-4">
            <div
                className={`w-12 h-12 ${color} rounded-full flex items-center justify-center text-2xl flex-shrink-0`}
            >
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600">{description}</p>
            </div>
        </div>
    );
};

const Home: React.FC = () => {
    // Hàm cuộn về đầu trang
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn mượt mà
    };

    return (
        <main className="w-full overflow-x-hidden">
            <ScrollToTop /> {/* Giữ nguyên cho route-level */}

            <Banner />

            {/* Phần Khám Phá */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=300&h=300&fit=crop"
                            alt="Đền"
                            className="rounded-3xl w-full h-80 object-cover"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=300&h=300&fit=crop"
                            alt="Bãi biển"
                            className="rounded-3xl w-full h-80 object-cover mt-8"
                        />
                    </div>

                    <div>
                        <span className="text-amber-500 font-semibold text-sm">KHÁM PHÁ CÙNG CHÚNG TÔI</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2 mb-4">
                            Khám Phá Tất Cả Các Góc Thế Giới Cùng Chúng Tôi
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Chúng tôi cung cấp cho bạn nhiều gói dịch vụ và ưu đãi cho du lịch và tham quan. Chúng tôi cam kết
                            mang đến cho bạn dịch vụ tốt nhất và sự hài lòng. Các chuyên gia du lịch của chúng tôi đang chờ đón
                            bạn.
                        </p>
                        <button className="px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition duration-300">
                            Khám Phá Thêm
                        </button>
                    </div>
                </div>
            </section>

            {/* Phần Tính Năng */}
            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-amber-500 font-semibold text-sm">TẠI SAO ĐẶT TOUR CÙNG CHÚNG TÔI</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2 mb-12">
                        Những Tính Năng Tốt Nhất Cho Bạn
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon="🗺️"
                            title="Hướng Dẫn Viên Tốt Nhất"
                            description="Dịch vụ hướng dẫn của chúng tôi đảm bảo bạn sẽ có trải nghiệm tour toàn diện và thú vị"
                            color="bg-blue-100"
                        />
                        <FeatureCard
                            icon="✅"
                            title="Tour Đáng Tin Cậy"
                            description="Chúng tôi cung cấp các tour chất lượng và đáng tin cậy để chuyến đi của bạn thoải mái nhất có thể"
                            color="bg-red-100"
                        />
                        <FeatureCard
                            icon="💰"
                            title="Giá Cả Thân Thiện"
                            description="Chúng tôi mang đến mức giá cạnh tranh nhất mà không đánh đổi chất lượng dịch vụ"
                            color="bg-yellow-100"
                        />
                    </div>

                    <button className="mt-12 px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition duration-300">
                        Khám Phá Thêm
                    </button>
                </div>
            </section>

            <TopDestinations />
            <PopularTours />
            <FreshlyAdded />
            <TravelDealsPage />
            <TestimonialsCarousel />

            {/* Nút Quay lại đầu trang */}
            <div className="text-center py-8">
                <button
                    onClick={scrollToTop}
                    className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition duration-300"
                >
                    Quay Lại Đầu Trang
                </button>
            </div>
        </main>
    );
};

export default Home;