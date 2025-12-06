import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Grid, List, MapPin, Clock, Users, X, Briefcase, Eye } from 'lucide-react';
import { debounce } from 'lodash';

import {
    fetchTours,
    fetchDestinations,
    fetchToursByDestination,
    fetchTourCategories,
    fetchTourStats
} from '../../services/tourService';
import type { Tour, Destination, TourCategory, TourStatsData } from '../../services/tourService';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface TourResponse {
    tours: Tour[];
    totalPages: number;
    totalItems?: number;
}

const TourComponent: React.FC = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('release');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchLocation, setSearchLocation] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [page, setPage] = useState(0);
    const [tours, setTours] = useState<Tour[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItemsInFilter, setTotalItemsInFilter] = useState<number | undefined>(undefined);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [categories, setCategories] = useState<TourCategory[]>([]);
    const [stats, setStats] = useState<TourStatsData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const destinationId = searchParams.get('destinationId');

    const isFiltering = () => {
        return (
            searchKeyword.trim() !== '' ||
            searchLocation !== 'all' ||
            selectedCategory !== 'all' ||
            minPrice !== '' ||
            maxPrice !== ''
        );
    };

    const loadDestinations = async () => {
        try {
            const data = await fetchDestinations();
            setDestinations(data);
        } catch (err: any) {
            setError(err.message || 'Không thể tải danh sách điểm đến');
        }
    };

    const loadCategories = async () => {
        try {
            const data = await fetchTourCategories();
            setCategories(data);
        } catch (err) {
            console.error('Lỗi tải loại tour:', err);
        }
    };

    const loadTours = async () => {
        setLoading(true);
        setError(null);
        try {
            let response: TourResponse;

            if (destinationId) {
                response = await fetchToursByDestination(destinationId);
            } else {
                const result = await fetchTours(
                    page,
                    searchKeyword || undefined,
                    searchLocation === 'all' ? undefined : searchLocation,
                    'ACTIVE',
                    minPrice || undefined,
                    maxPrice || undefined,
                    selectedCategory === 'all' ? undefined : selectedCategory
                );

                response = {
                    tours: result.tours,
                    totalPages: result.totalPages,
                    totalItems: result.totalItems
                };
            }

            setTours(response.tours);
            setTotalPages(response.totalPages || 1);
            setTotalItemsInFilter(response.totalItems);
        } catch (err: any) {
            setError(err.message || 'Không thể tải danh sách tour');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDestinations();
        loadCategories();

        if (!destinationId) {
            const loadStats = async () => {
                try {
                    const data = await fetchTourStats();
                    setStats(data);
                } catch (err) {
                    console.error('Lỗi tải thống kê:', err);
                }
            };
            loadStats();
        }

        loadTours();
    }, [page, destinationId]);

    const debouncedLoadTours = debounce(() => {
        if (!destinationId) setPage(0);
        loadTours();
    }, 500);

    useEffect(() => {
        if (!destinationId) debouncedLoadTours();
        return () => debouncedLoadTours.cancel();
    }, [searchKeyword, searchLocation, minPrice, maxPrice, selectedCategory]);

    const handleSearch = () => {
        if (destinationId) return;
        debouncedLoadTours();
    };

    const handleReset = () => {
        setSearchKeyword('');
        setSearchLocation('all');
        setSelectedCategory('all');
        setMinPrice('');
        setMaxPrice('');
        setPage(0);
        setTotalItemsInFilter(undefined);
        loadTours();
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !destinationId) {
            handleSearch();
        }
    };

    const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setMinPrice(value);
            setPage(0);
        }
    };

    const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setMaxPrice(value);
            setPage(0);
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

    const goToTourDetail = (tourId: number) => {
        navigate(`/tour/${tourId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* HERO */}
            <motion.div
                className="bg-gradient-to-br from-gray-50 to-gray-100 py-48 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <motion.div className="absolute top-10 left-10 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.h1
                        className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4 tracking-tight"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {destinationId
                            ? `Tour tại ${destinations.find(d => d.id === Number(destinationId))?.name || 'Điểm đến'}`
                            : 'Khám Phá Thế Giới'}
                    </motion.h1>
                    <motion.p className="text-xl text-cyan-600 mb-8 mt-8"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Tìm kiếm và đặt tour du lịch tuyệt vời nhất
                    </motion.p>

                    {!destinationId && (
                        <motion.div className="max-w-2xl mx-auto"
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

            {/* MAIN CONTENT */}
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* SIDEBAR */}
                    {!destinationId && (
                        <aside className="lg:w-80 flex-shrink-0">
                            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-4 shadow-sm">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-cyan-600" />
                                        Bộ Lọc
                                    </h2>
                                    <button
                                        onClick={handleReset}
                                        className="text-sm text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
                                    >
                                        <X className="w-4 h-4" /> Xóa tất cả
                                    </button>
                                </div>

                                {/* Filters */}
                                <div className="space-y-6">
                                    {/* Địa điểm */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Địa điểm
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <select
                                                value={searchLocation}
                                                onChange={(e) => setSearchLocation(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                                            >
                                                <option value="all">Tất cả địa điểm</option>
                                                {destinations.map((dest) => (
                                                    <option key={dest.id} value={dest.name}>{dest.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Loại tour */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Loại tour
                                        </label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                                            >
                                                <option value="all">Tất cả loại tour</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Khoảng giá */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Khoảng giá (VNĐ)
                                        </label>

                                        <div className="mb-4">
                                            <p className="text-xs font-medium text-gray-600 mb-2">Khoảng giá nhanh</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    { label: 'Dưới 2 triệu', min: '', max: '2000000' },
                                                    { label: '2 - 5 triệu', min: '2000000', max: '5000000' },
                                                    { label: '5 - 10 triệu', min: '5000000', max: '10000000' },
                                                    { label: 'Trên 10 triệu', min: '10000000', max: '' },
                                                ].map((preset) => {
                                                    const isActive = minPrice === preset.min && maxPrice === preset.max;
                                                    return (
                                                        <button
                                                            key={preset.label}
                                                            onClick={() => {
                                                                setMinPrice(preset.min);
                                                                setMaxPrice(preset.max);
                                                                setPage(0);
                                                            }}
                                                            className={`px-2 py-2 rounded-lg text-xs font-medium transition-all border-2 ${isActive
                                                                ? 'bg-cyan-600 text-white border-cyan-600 shadow-md'
                                                                : 'bg-white border-gray-300 hover:border-cyan-400 text-gray-700'
                                                                }`}
                                                        >
                                                            {preset.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 my-3"></div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-600 mb-2">Khoảng giá tùy chỉnh</p>
                                            <div className="space-y-2">
                                                <div className="flex flex-col gap-2">
                                                    <input
                                                        type="number"
                                                        placeholder="Từ"
                                                        value={minPrice}
                                                        onChange={handleMinPriceChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 text-sm"
                                                    />
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-gray-400 text-sm">Down Arrow</span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        placeholder="Đến"
                                                        value={maxPrice}
                                                        onChange={handleMaxPriceChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 text-sm"
                                                    />
                                                </div>
                                                {(minPrice || maxPrice) && (
                                                    <button
                                                        onClick={() => {
                                                            setMinPrice('');
                                                            setMaxPrice('');
                                                            setPage(0);
                                                        }}
                                                        className="w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 transition-all border-2 border-red-600"
                                                    >
                                                        <X className="w-4 h-4 inline mr-1" />
                                                        Xóa bộ lọc giá
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    )}

                    {/* MAIN CONTENT */}
                    <main className="flex-1">
                        <div className="bg-white border border-gray-200 p-6 mb-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {isFiltering()
                                            ? `${totalItemsInFilter !== undefined ? totalItemsInFilter : sortedTours.length} Tour Phù Hợp`
                                            : destinationId
                                                ? `${sortedTours.length} Tour`
                                                : stats
                                                    ? `Tổng cộng ${stats.totalTours} Tour`
                                                    : 'Đang tải...'}
                                    </h2>
                                    <p className="text-gray-600 mt-1">
                                        {isFiltering()
                                            ? 'Dựa trên bộ lọc của bạn'
                                            : destinationId
                                                ? 'Tại điểm đến này'
                                                : 'Khám phá những điểm đến tuyệt vời'}
                                    </p>
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
                                        <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                            <List className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                            <Grid className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {loading && (
                            <div className="text-center py-12">
                                <p className="text-gray-600">Đang tải...</p>
                            </div>
                        )}

                        {error && (
                            <div className="text-center py-12">
                                <p className="text-red-600">{error}</p>
                            </div>
                        )}

                        {!loading && !error && sortedTours.length > 0 && (
                            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}`}>
                                {sortedTours.map((tour) => (
                                    <div
                                        key={tour.id}
                                        className={`bg-white border border-gray-200 overflow-hidden group cursor-pointer transition-all hover:border-cyan-300 ${viewMode === 'grid' ? 'rounded-lg' : 'flex flex-row'}`}
                                        onClick={() => goToTourDetail(tour.id)}
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
                                                        {tour.categoryName && (
                                                            <div className="text-cyan-600 font-medium mb-3 flex items-center gap-2">
                                                                <Briefcase className="w-5 h-5" />
                                                                {tour.categoryName}
                                                            </div>
                                                        )}

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
                                                            <span className="flex items-center gap-1 ml-auto">
                                                                <Eye className="w-4 h-4" />
                                                                {tour.views?.toLocaleString('vi-VN') || 0}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <span className="text-gray-600 text-sm block mb-1">Từ</span>
                                                            <span className="text-3xl font-bold text-cyan-500">
                                                                {tour.price.toLocaleString('vi-VN')}₫
                                                            </span>
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
                                                            <span className="flex items-center gap-1 ml-auto">
                                                                <Eye className="w-4 h-4" />
                                                                {tour.views?.toLocaleString('vi-VN') || 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-5">
                                                    {tour.categoryName && (
                                                        <div className="flex items-center gap-2 text-cyan-600 text-sm font-medium mb-2">
                                                            <Briefcase className="w-4 h-4" />
                                                            {tour.categoryName}
                                                        </div>
                                                    )}

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
                                                                <span className="text-2xl font-bold text-cyan-600">
                                                                    {tour.price.toLocaleString('vi-VN')}₫
                                                                </span>
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

                        {/* PHÂN TRANG */}
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

                        {/* KHÔNG CÓ KẾT QUẢ */}
                        {!loading && !error && sortedTours.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <Search className="w-16 h-16 mx-auto" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    {isFiltering()
                                        ? 'Không tìm thấy tour phù hợp với bộ lọc'
                                        : 'Chưa có tour nào'}
                                </h3>
                                <p className="text-gray-600">
                                    {isFiltering()
                                        ? 'Vui lòng thử lại với các tiêu chí khác'
                                        : 'Hãy quay lại sau hoặc liên hệ chúng tôi'}
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default TourComponent;