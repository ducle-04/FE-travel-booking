import React from "react";
import Banner from "../../components/Layout/DefautLayout/UserLayout/Banner/Banner";

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
    return (
        <main className="w-full overflow-x-hidden">

            {/* ✅ Banner full màn hình */}
            <section className="w-full">
                <Banner />
            </section>

            {/* Explore Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src="https://images.unsplash.com/photo-1528127269029-5b21c3758a21?w=300&h=300&fit=crop"
                            alt="Temple"
                            className="rounded-3xl w-full h-80 object-cover"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=300&h=300&fit=crop"
                            alt="Beach"
                            className="rounded-3xl w-full h-80 object-cover mt-8"
                        />
                    </div>

                    <div>
                        <span className="text-amber-500 font-semibold text-sm">EXPLORE WITH US</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2 mb-4">
                            Investigate All Corners Of The World With Us
                        </h2>
                        <p className="text-gray-600 mb-8">
                            We provide you different packages and offers for travel and tourism. We assure you
                            to give you the best service and enjoyment. Our travel experts are waiting for
                            you.
                        </p>
                        <button className="px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition duration-300">
                            Explore More
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-amber-500 font-semibold text-sm">WHY BOOK WITH US</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2 mb-12">
                        Best Features For You
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon="🗺️"
                            title="Best Tour Guide"
                            description="Our guide service ensures that you'll have a comprehensive and enjoyable tour experience"
                            color="bg-blue-100"
                        />
                        <FeatureCard
                            icon="✅"
                            title="Reliable Tour"
                            description="We provide reliable and quality tours to make your trip as comfortable as possible"
                            color="bg-red-100"
                        />
                        <FeatureCard
                            icon="💰"
                            title="Friendly Price"
                            description="We offer the most competitive prices without compromising on the quality of services"
                            color="bg-yellow-100"
                        />
                    </div>

                    <button className="mt-12 px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition duration-300">
                        Explore More
                    </button>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&h=300&fit=crop" className="rounded-2xl w-full h-72 object-cover" />
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop" className="rounded-2xl w-full h-72 object-cover" />
                    <div className="md:col-span-1 lg:col-span-2 grid grid-cols-2 gap-4">
                        <img src="https://images.unsplash.com/photo-1503803548695-659e10de5dba?w=300&h=300&fit=crop" className="rounded-2xl w-full h-72 object-cover" />
                        <img src="https://images.unsplash.com/photo-1500595046891-45ba79b3ce35?w=300&h=300&fit=crop" className="rounded-2xl w-full h-72 object-cover" />
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
