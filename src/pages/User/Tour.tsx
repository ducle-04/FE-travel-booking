import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Grid, List, MapPin, Clock, Users, X } from 'lucide-react';
import { debounce } from 'lodash';
import { fetchTours2, fetchDestinations, fetchToursByDestination } from '../../services/tourService';
import type { Tour, Destination, TourResponse } from '../../services/tourService';
import { useSearchParams, useNavigate } from 'react-router-dom';

const TourComponent: React.FC = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('release');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchLocation, setSearchLocation] = useState('all');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [page, setPage] = useState(0);
    const [tours, setTours] = useState<Tour[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate(); // THÊM: dùng để chuyển trang

    const destinationId = searchParams.get('destinationId');

    // Lấy danh sách điểm đến
    const loadDestinations = async () => {
        try {
            const data = await fetchDestinations();
            setDestinations(data);
        } catch (err: any) {
            setError(err.message || 'Không thể tải danh sách điểm đến');
        }
    };

    // Lấy danh sách tour
    const loadTours = async () => {
        setLoading(true);
        setError(null);
        try {
            let response: TourResponse;
            if (destinationId) {
                response = await fetchToursByDestination(destinationId);
            } else {
                response = await fetchTours2(
                    page,
                    searchKeyword,
                    searchLocation === 'all' ? undefined : searchLocation,
                    minPrice,
                    maxPrice
                );
            }
            const activeTours = response.tours.filter(tour => tour.status === 'ACTIVE');
            setTours(activeTours);
            setTotalPages(response.totalPages || 1);
        } catch (err: any) {
            setError(err.message || 'Không thể tải danh sách tour');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDestinations();
        loadTours();
    }, [page, destinationId]);

    const debouncedLoadTours = debounce(() => {
        if (!destinationId) {
            setPage(0);
        }
        loadTours();
    }, 500);

    const handleSearch = () => {
        if (destinationId) return;
        debouncedLoadTours();
    };

    const handleReset = () => {
        setSearchKeyword('');
        setSearchLocation('all');
        setMinPrice('');
        setMaxPrice('');
        setPage(0);
        loadTours();
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !destinationId) {
            handleSearch();
        }
    };

    const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (Number(value) >= 0 || value === '') {
            setMinPrice(value);
        }
    };

    const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (Number(value) >= 0 || value === '') {
            setMaxPrice(value);
        }
    };

    const sortedTours = [...tours].sort((a, b) => {
        if (sortBy === 'price') return a.price - b.price;
        if (sortBy === 'rating') return (b.averageRating || 0) - (a.averageRating || 0);
        if (sortBy === 'popular') return (b.totalParticipants || 0) - (a.totalParticipants || 0);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const getPageNumbers = () => {
        const maxPagesToShow = 5;
        const startPage = Math.max(0, page - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow);
        return Array.from({ length: endPage - startPage }, (_, i) => startPage + i);
    };

    // CHUYỂN ĐẾN TRANG CHI TIẾT TOUR
    const goToTourDetail = (tourId: number) => {
        navigate(`/tour/${tourId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Header with Search */}
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
                        {destinationId ? `Tour tại ${destinations.find(d => d.id === Number(destinationId))?.name || 'Điểm đến'}` : 'Khám Phá Thế Giới'}
                    </motion.h1>
                    <motion.p
                        className="text-xl text-cyan-600 mb-8 mt-8"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Tìm kiếm và đặt tour du lịch tuyệt vời nhất
                    </motion.p>

                    {/* Search Bar */}
                    {!destinationId && (
                        <motion.div
                            className="max-w-2xl mx-auto"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <div className="relative flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm tour..."
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-200 focus:border-cyan-500 focus:outline-none transition-colors text-gray-900 bg-white"
                                    />
                                </div>
                                <button
                                    onClick={handleSearch}
                                    className="bg-cyan-500 text-white px-6 py-4 rounded-full hover:bg-cyan-600 transition font-medium"
                                >
                                    Tìm kiếm
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* Main Content with Sidebar */}
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filter */}
                    {!destinationId && (
                        <aside className="lg:w-80 flex-shrink-0">
                            <div className="bg-white border border-gray-200 p-6 sticky top-4">
                                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-cyan-600" />
                                    Bộ Lọc
                                </h2>

                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Địa điểm</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <select
                                            value={searchLocation}
                                            onChange={(e) => setSearchLocation(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
                                        >
                                            <option value="all">Tất cả địa điểm</option>
                                            {destinations.map((dest) => (
                                                <option key={dest.id} value={dest.name}>
                                                    {dest.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Khoảng giá ($)</label>
                                    <div className="space-y-3">
                                        <input
                                            type="number"
                                            placeholder="Giá thấp nhất"
                                            value={minPrice}
                                            onChange={handleMinPriceChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Giá cao nhất"
                                            value={maxPrice}
                                            onChange={handleMaxPriceChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSearch}
                                        className="flex-1 bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition font-medium"
                                    >
                                        Tìm kiếm
                                    </button>
                                    <button
                                        onClick={handleReset}
                                        className="flex-1 flex items-center justify-center gap-1 text-cyan-600 py-2 rounded-lg hover:text-cyan-700 transition font-medium"
                                    >
                                        <X className="w-4 h-4" />
                                        Xóa bộ lọc
                                    </button>
                                </div>
                            </div>
                        </aside>
                    )}

                    {/* Main Content Area */}
                    <main className="flex-1">
                        <div className="bg-white border border-gray-200 p-6 mb-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold">{sortedTours.length} Tour Phù Hợp</h2>
                                    <p className="text-gray-600 mt-1">Khám phá những điểm đến tuyệt vời</p>
                                </div>

                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                                        <span className="text-sm font-medium whitespace-nowrap">Sắp xếp:</span>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        >
                                            <option value="release">Mới nhất</option>
                                            <option value="price">Giá</option>
                                            <option value="rating">Đánh giá</option>
                                            <option value="popular">Phổ biến</option>
                                        </select>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                                        >
                                            <List className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                                        >
                                            <Grid className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="text-center py-12">
                                <p className="text-gray-600">Đang tải...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="text-center py-12">
                                <p className="text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Tours Grid/List */}
                        {!loading && !error && (
                            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}`}>
                                {sortedTours.map((tour) => (
                                    <div
                                        key={tour.id}
                                        className={`bg-white border border-gray-200 overflow-hidden group cursor-pointer transition-all hover:border-cyan-300 ${viewMode === 'grid' ? 'rounded-lg' : 'flex flex-row'}`}
                                        onClick={() => goToTourDetail(tour.id)} // CHUYỂN ĐẾN CHI TIẾT
                                    >
                                        {viewMode === 'list' ? (
                                            <>
                                                <div className="relative overflow-hidden w-80 flex-shrink-0">
                                                    <img
                                                        src={tour.imageUrl}
                                                        alt={tour.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Tour'; }}
                                                    />
                                                </div>

                                                <div className="flex-1 p-8 flex flex-col justify-between">
                                                    <div>
                                                        <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-600 transition">
                                                            {tour.name}
                                                        </h3>

                                                        <div className="flex items-center gap-1 mb-4">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-5 h-5 ${i < Math.round(tour.averageRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                                />
                                                            ))}
                                                            <span className="text-sm text-gray-600 ml-2">({tour.reviewsCount} đánh giá)</span>
                                                        </div>

                                                        <div className="text-sm text-gray-600 mb-4">
                                                            <span className="flex items-center gap-1 mb-2">
                                                                <MapPin className="w-4 h-4" />
                                                                {tour.destinationName}
                                                            </span>
                                                            <span className="flex items-center gap-1 mb-2">
                                                                <Clock className="w-4 h-4" />
                                                                {tour.duration}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Users className="w-4 h-4" />
                                                                {tour.totalParticipants} khách tham gia
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <span className="text-gray-600 text-sm block mb-1">Từ</span>
                                                            <span className="text-3xl font-bold text-cyan-500">${tour.price.toLocaleString()}</span>
                                                        </div>

                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); goToTourDetail(tour.id); }}
                                                            className="bg-cyan-500 text-white px-6 py-3 font-medium hover:bg-cyan-600 transition"
                                                        >
                                                            XEM CHI TIẾT
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="relative overflow-hidden h-80">
                                                    <img
                                                        src={tour.imageUrl}
                                                        alt={tour.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Tour'; }}
                                                    />
                                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                                        <div className="flex items-center text-white text-sm gap-4">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-4 h-4" />
                                                                {tour.duration}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Users className="w-4 h-4" />
                                                                {tour.totalParticipants} khách
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-5">
                                                    <div className="flex items-center gap-2 text-cyan-600 text-sm mb-2">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{tour.destinationName}</span>
                                                    </div>

                                                    <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-cyan-600 transition">
                                                        {tour.name}
                                                    </h3>

                                                    <div className="flex items-center gap-1 mb-4">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 ${i < Math.round(tour.averageRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                            />
                                                        ))}
                                                        <span className="text-sm text-gray-600 ml-1">({tour.reviewsCount} đánh giá)</span>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-4 border-t">
                                                        <div>
                                                            <div className="flex items-baseline gap-1">
                                                                <span className="text-2xl font-bold text-cyan-600">${tour.price.toLocaleString()}</span>
                                                                <span className="text-sm text-gray-600">/người</span>
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); goToTourDetail(tour.id); }}
                                                            className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition font-medium"
                                                        >
                                                            Xem chi tiết
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && !error && sortedTours.length > 0 && (
                            <div className="flex justify-center mt-8">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                                        disabled={page === 0}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
                                    >
                                        Trước
                                    </button>
                                    {getPageNumbers().map((i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPage(i)}
                                            className={`px-4 py-2 rounded-lg ${page === i ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                                        disabled={page === totalPages - 1}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
                                    >
                                        Sau
                                    </button>
                                </div>
                            </div>
                        )}

                        {!loading && !error && sortedTours.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <Search className="w-16 h-16 mx-auto" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy tour phù hợp</h3>
                                <p className="text-gray-600">Vui lòng thử lại với các tiêu chí tìm kiếm khác</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <section className="bg-gradient-to-r from-gray-700 to-gray-900 text-white py-16 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Bạn không tìm thấy tour phù hợp?</h2>
                    <p className="text-xl mb-8 text-gray-200">Liên hệ với chúng tôi để được tư vấn tour theo yêu cầu</p>
                    <button className="bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition">
                        Liên hệ tư vấn
                    </button>
                </div>
            </section>
        </div>
    );
};

export default TourComponent;