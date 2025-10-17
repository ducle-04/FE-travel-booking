import React from "react";
import Banner from "../../components/Layout/DefautLayout/UserLayout/Banner/Banner";
import TopDestinations from "../../components/Layout/DefautLayout/UserLayout/Home/TopDestinations";
import PopularTours from "../../components/Layout/DefautLayout/UserLayout/Home/PopularTours";
import FreshlyAdded from "../../components/Layout/DefautLayout/UserLayout/Home/FreshlyAdded";
import TravelDealsPage from "../../components/Layout/DefautLayout/UserLayout/Home/TravelDealsPage";
import TestimonialsCarousel from "../../components/Layout/DefautLayout/UserLayout/Home/TestimonialsCarousel";
import WhyChoose from "../../components/Layout/DefautLayout/UserLayout/Home/WhyChoose";
import ScrollToTop from "../../components/OtherComponent/ScrollToTop";
import ExploreSection from "../../components/Layout/DefautLayout/UserLayout/Home/ExploreSection";

const Home: React.FC = () => {
    // Hàm cuộn về đầu trang
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <main className="w-full overflow-x-hidden">
            <ScrollToTop />
            <Banner />
            <ExploreSection />
            <TopDestinations />
            <PopularTours />
            <FreshlyAdded />
            <TravelDealsPage />
            <TestimonialsCarousel />
            <WhyChoose />
            <div className="text-center py-8">
                <button
                    onClick={scrollToTop}
                    className="px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition duration-300"
                >
                    Quay Lại Đầu Trang
                </button>
            </div>
        </main>
    );
};

export default Home;