import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter } from 'lucide-react';
import { fetchDestinations, searchDestinations, filterDestinationsByRegion } from '../../services/destinationService';
import DestinationCard from '../../components/Layout/DefautLayout/UserLayout/Destinations/DestinationCard';

interface Destination {
    id: string;
    name: string;
    region: 'Bắc' | 'Trung' | 'Nam';
    description: string;
    imageUrl: string;
    toursCount: number;
    status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
}

const regions = [
    { id: 'all', name: 'Tất cả', icon: '🇻🇳' },
    { id: 'Bắc', name: 'Miền Bắc', icon: '🏔️' },
    { id: 'Trung', name: 'Miền Trung', icon: '🏖️' },
    { id: 'Nam', name: 'Miền Nam', icon: '🌴' },
];

export default function DestinationsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('all');
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Lấy danh sách điểm đến từ backend
    useEffect(() => {
        const loadDestinations = async () => {
            try {
                setLoading(true);
                const destinationsData = await fetchDestinations();
                setDestinations(destinationsData);
                setLoading(false);
            } catch (err) {
                setError('Không thể tải danh sách điểm đến. Vui lòng thử lại sau.');
                setLoading(false);
            }
        };
        loadDestinations();
    }, []);

    // Xử lý tìm kiếm theo tên
    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        try {
            setLoading(true);
            let destinationsData;
            if (query.trim()) {
                destinationsData = await searchDestinations(query);
            } else {
                destinationsData = await fetchDestinations();
            }
            setDestinations(destinationsData);
            setLoading(false);
        } catch (err) {
            setError('Lỗi khi tìm kiếm điểm đến. Vui lòng thử lại.');
            setLoading(false);
        }
    };

    // Xử lý lọc theo khu vực
    const handleRegionFilter = async (region: string) => {
        setSelectedRegion(region);
        try {
            setLoading(true);
            let destinationsData;
            if (region !== 'all') {
                destinationsData = await filterDestinationsByRegion(region);
            } else {
                destinationsData = await fetchDestinations();
            }
            setDestinations(destinationsData);
            setLoading(false);
        } catch (err) {
            setError('Lỗi khi lọc điểm đến theo khu vực. Vui lòng thử lại.');
            setLoading(false);
        }
    };

    const filteredDestinations = useMemo(() => {
        return destinations.filter(dest => {
            const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dest.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRegion = selectedRegion === 'all' || dest.region === selectedRegion;
            const isActive = dest.status === 'ACTIVE';
            return matchesSearch && matchesRegion && isActive;
        });
    }, [destinations, searchQuery, selectedRegion]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <motion.div
                className="bg-gradient-to-br from-gray-50 to-gray-100 py-48 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <motion.div
                    className="absolute top-10 left-10 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.h1
                        className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4 tracking-tight"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Khám Phá Việt Nam
                    </motion.h1>
                    <motion.p
                        className="text-xl text-cyan-600 mb-8 mt-8"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Tìm kiếm điểm đến trong mơ của bạn
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        className="max-w-2xl mx-auto"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm địa điểm..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-200 focus:border-cyan-500 focus:outline-none transition-colors text-gray-900 bg-white"
                            />
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {error && (
                    <motion.div
                        className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {error}
                    </motion.div>
                )}

                {loading ? (
                    <motion.div
                        className="text-center py-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="text-gray-500 text-lg">Đang tải danh sách điểm đến...</p>
                    </motion.div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar - Filters */}
                        <motion.div
                            className="lg:w-64 flex-shrink-0"
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="bg-white rounded-2xl p-6 sticky top-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <Filter size={20} className="text-cyan-500" />
                                    <h3 className="text-lg font-bold text-gray-900">Lọc theo miền</h3>
                                </div>
                                <div className="space-y-2">
                                    {regions.map((region) => (
                                        <motion.button
                                            key={region.id}
                                            onClick={() => handleRegionFilter(region.id)}
                                            className={`w-full text-left px-4 py-3 rounded-xl transition-all ${selectedRegion === region.id
                                                ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <span className="mr-2">{region.icon}</span>
                                            {region.name}
                                        </motion.button>
                                    ))}
                                </div>

                                {/* Stats */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <p className="text-sm text-gray-600">
                                        Tìm thấy <span className="font-bold text-cyan-600">{filteredDestinations.length}</span> địa điểm
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Main Content Area */}
                        <div className="flex-1">
                            {/* Destinations Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                {filteredDestinations.length === 0 ? (
                                    <motion.div
                                        className="text-center py-12 col-span-2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <p className="text-gray-500 text-lg">Không tìm thấy địa điểm phù hợp</p>
                                    </motion.div>
                                ) : (
                                    filteredDestinations.map((destination, index) => (
                                        <DestinationCard key={destination.id} destination={destination} index={index} />
                                    ))
                                )}
                            </div>

                            {/* Map Section */}
                            <motion.div
                                className="bg-white rounded-2xl p-6 md:p-8 mb-12 border border-gray-100"
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <MapPin size={22} className="text-cyan-600" />
                                    <h3 className="text-2xl font-semibold text-gray-900">Bản Đồ Địa Điểm</h3>
                                </div>
                                <div className="relative w-full h-[500px] rounded-xl overflow-hidden border border-gray-200">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096339873328!2d105.84713001531662!3d21.028811985998207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab009cd0a263%3A0x3b8d9d6a7c7b7b7b!2sHanoi%2C%20Vietnam!5e0!3m2!1sen!2svn!4v1697671234567"
                                        className="absolute inset-0 w-full h-full"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        title="Bản đồ địa điểm du lịch tại Việt Nam"
                                    ></iframe>
                                </div>
                                <p className="text-center text-gray-600 mt-4">
                                    Bản đồ tương tác hiển thị các địa điểm du lịch nổi bật tại Việt Nam.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}