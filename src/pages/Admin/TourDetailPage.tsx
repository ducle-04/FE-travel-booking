import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, MapPin, Clock, DollarSign, Star, Users, CalendarCheck,
    UserCheck, CalendarDays, Edit2, X, ZoomIn, Trash2, Plus, Hotel as HotelIcon,
    Search, ChevronLeft, ChevronRight, Loader2, Tag, Waves, Trees, Landmark, Utensils, Briefcase, Check
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import ImagePreviewModal from '../../components/Layout/DefautLayout/AdminLayout/DestinationManagement/ImagePreviewModal';

// Services
import {
    fetchTourDetail,
    updateTourDetail,
    deleteAdditionalImage,
    deleteVideo
} from '../../services/tourDetailService';

import { fetchHotels } from '../../services/hotelService';

// Types
import type {
    TransportDTO,
    HotelDTO,
    TourDetail as TourDetailType
} from '../../services/tourDetailService';

interface Tour {
    id: number;
    name: string;
    imageUrl: string;
    destinationName: string;
    duration: string;
    price: number;
    description: string;
    averageRating: number;
    totalParticipants: number;
    maxParticipants: number;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    bookingsCount: number;
    reviewsCount: number;
    categoryName?: string;
    categoryIcon?: string;
    startDates?: string[];
    tourDetail?: TourDetailType | null;
}

const TourDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { theme } = useTheme();

    const [tour, setTour] = useState<Tour | null>(null);
    const [detail, setDetail] = useState<TourDetailType>({
        itinerary: '',
        departurePoint: '',
        departureTime: '',
        suitableFor: '',
        cancellationPolicy: '',
        transports: [],
        selectedHotels: [],
        additionalImages: [],
        videos: []
    });

    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hotelActionLoading, setHotelActionLoading] = useState(false);

    const [formData, setFormData] = useState({
        itinerary: '',
        departurePoint: '',
        departureTime: '',
        suitableFor: '',
        cancellationPolicy: ''
    });

    const [transports, setTransports] = useState<TransportDTO[]>([]);
    const [selectedHotelIds, setSelectedHotelIds] = useState<number[]>([]);
    const [selectedHotels, setSelectedHotels] = useState<HotelDTO[]>([]);

    const [additionalImages, setAdditionalImages] = useState<File[]>([]);
    const [videos, setVideos] = useState<File[]>([]);

    const [showImageModal, setShowImageModal] = useState(false);
    const [imageModalUrl, setImageModalUrl] = useState<string | null>(null);

    // Modal chọn khách sạn
    const [showHotelModal, setShowHotelModal] = useState(false);
    const [hotelSearch, setHotelSearch] = useState('');
    const [hotelPage, setHotelPage] = useState(0);
    const [hotels, setHotels] = useState<HotelDTO[]>([]);
    const [hotelTotalPages, setHotelTotalPages] = useState(0);
    const [loadingHotels, setLoadingHotels] = useState(false);

    const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken') || '';

    const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    const formatDate = (date: string) => new Date(date).toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const getCategoryIcon = (iconName?: string) => {
        switch (iconName) {
            case 'Waves': return <Waves size={20} className="text-white" />;
            case 'Trees': return <Trees size={20} className="text-white" />;
            case 'Landmark': return <Landmark size={20} className="text-white" />;
            case 'Utensils': return <Utensils size={20} className="text-white" />;
            case 'Briefcase': return <Briefcase size={20} className="text-white" />;
            default: return <Tag size={20} className="text-white" />;
        }
    };

    useEffect(() => {
        if (id) fetchTourDetailData();
    }, [id]);

    const fetchTourDetailData = async () => {
        setLoading(true);
        try {
            const tourData = await fetchTourDetail(id!);
            setTour(tourData);

            if (tourData.tourDetail) {
                const d = tourData.tourDetail;
                setDetail(d);
                setFormData({
                    itinerary: d.itinerary || '',
                    departurePoint: d.departurePoint || '',
                    departureTime: d.departureTime || '',
                    suitableFor: d.suitableFor || '',
                    cancellationPolicy: d.cancellationPolicy || ''
                });
                setTransports(d.transports || []);
                setSelectedHotels(d.selectedHotels || []);
                setSelectedHotelIds(d.selectedHotels?.map(h => h.id) || []);
            }
        } catch (error: any) {
            toast.error(error.message || 'Không thể tải chi tiết tour');
            navigate('/admin/tours');
        } finally {
            setLoading(false);
        }
    };

    const loadHotels = async (search: string = '', page: number = 0) => {
        setLoadingHotels(true);
        try {
            const result = await fetchHotels(page, search.trim() || undefined, undefined, 'all', '');

            const mappedHotels: HotelDTO[] = result.hotels.map((hotel: any) => ({
                id: hotel.id,
                name: hotel.name,
                address: hotel.address,
                starRating: hotel.starRating?.toString() || 'Chưa xếp hạng',
                description: hotel.description || 'Không có mô tả',
                status: hotel.status,
                images: hotel.images || [],
                videos: hotel.videos || [],
            }));

            setHotels(mappedHotels);
            setHotelTotalPages(result.totalPages);
            setHotelPage(result.currentPage);
        } catch (err) {
            toast.error('Không thể tải danh sách khách sạn');
        } finally {
            setLoadingHotels(false);
        }
    };

    useEffect(() => {
        if (showHotelModal) {
            loadHotels(hotelSearch, hotelPage);
        }
    }, [showHotelModal, hotelSearch, hotelPage]);

    const toggleHotel = (hotel: HotelDTO) => {
        setHotelActionLoading(true);
        const exists = selectedHotelIds.includes(hotel.id);

        if (exists) {
            setSelectedHotelIds(prev => prev.filter(id => id !== hotel.id));
            setSelectedHotels(prev => prev.filter(h => h.id !== hotel.id));
        } else {
            setSelectedHotelIds(prev => [...prev, hotel.id]);
            setSelectedHotels(prev => [...prev, hotel]);
        }

        setTimeout(() => setHotelActionLoading(false), 300);
    };

    const handleSubmitDetail = async () => {
        if (!id) return;

        const result = await Swal.fire({
            title: 'Xác nhận cập nhật',
            text: `Bạn có chắc muốn cập nhật chi tiết tour "${tour?.name}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Cập nhật',
            cancelButtonText: 'Hủy',
            reverseButtons: true,
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
        });

        if (!result.isConfirmed) return;

        setIsSubmitting(true);
        try {
            await updateTourDetail(token, id, {
                ...formData,
                transports,
                selectedHotelIds
            }, additionalImages, videos);

            toast.success('Cập nhật chi tiết tour thành công!');
            setEditing(false);
            setAdditionalImages([]);
            setVideos([]);
            await fetchTourDetailData();
        } catch (error: any) {
            toast.error(error.message || 'Cập nhật thất bại');
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteImage = async (imageUrl: string) => {
        const result = await Swal.fire({
            title: 'Xóa ảnh phụ?',
            text: 'Ảnh sẽ bị xóa vĩnh viễn',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            background: theme === 'dark' ? '#1f2937' : '#fff',
            color: theme === 'dark' ? '#e5e7eb' : '#374151'
        });

        if (result.isConfirmed && id) {
            try {
                await deleteAdditionalImage(token, id, imageUrl);
                toast.success('Xóa ảnh thành công');
                await fetchTourDetailData();
            } catch (error: any) {
                toast.error(error.message || 'Xóa ảnh thất bại');
            }
        }
    };

    const deleteVideoHandler = async (videoUrl: string) => {
        const result = await Swal.fire({
            title: 'Xóa video?',
            text: 'Video sẽ bị xóa vĩnh viễn',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            background: theme === 'dark' ? '#1f2937' : '#fff',
            color: theme === 'dark' ? '#e5e7eb' : '#374151'
        });

        if (result.isConfirmed && id) {
            try {
                await deleteVideo(token, id, videoUrl);
                toast.success('Xóa video thành công');
                await fetchTourDetailData();
            } catch (error: any) {
                toast.error(error.message || 'Xóa video thất bại');
            }
        }
    };

    const openImageModal = (url: string) => {
        setImageModalUrl(url);
        setShowImageModal(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    if (!tour) {
        return (
            <div className="text-center p-10 text-red-500 text-xl">
                Tour không tồn tại
            </div>
        );
    }

    return (
        <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-700' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700' : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'}`}
                    >
                        <ArrowLeft size={20} /> Quay lại
                    </button>
                    <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Chi Tiết Tour</h1>
                    <div />
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-600 shadow-xl">
                    <img
                        src={tour.imageUrl}
                        alt={tour.name}
                        className="w-full h-80 object-cover"
                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/1200x400?text=Ảnh+Tour'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                        <h1 className="text-4xl font-bold drop-shadow-lg">{tour.name}</h1>
                        <div className="flex items-center gap-4 mt-3">
                            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${tour.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-500'}`}>
                                {tour.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm dừng'}
                            </span>
                            {tour.categoryName && (
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-1.5 rounded-full">
                                    {getCategoryIcon(tour.categoryIcon)}
                                    <span className="font-medium">{tour.categoryName}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <InfoCard icon={MapPin} label="Điểm đến" value={tour.destinationName} color="blue" />
                    <InfoCard icon={Clock} label="Thời gian" value={tour.duration} color="green" />
                    <InfoCard icon={DollarSign} label="Giá tour" value={formatCurrency(tour.price)} color="purple" bold />
                    <InfoCard icon={Star} label="Đánh giá" value={`${tour.averageRating}/5 (${tour.reviewsCount} lượt)`} color="yellow" />
                </div>

                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <h3 className="text-xl font-semibold mb-3">Mô tả tour</h3>
                    <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {tour.description || 'Chưa có mô tả chi tiết.'}
                    </p>
                </div>

                {tour.startDates && tour.startDates.length > 0 && (
                    <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <CalendarCheck className="text-blue-600" size={24} />
                            Ngày Khởi Hành
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tour.startDates.map((date, i) => (
                                <div key={i} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Lịch trình {i + 1}</p>
                                    <p className="text-lg font-bold text-blue-900 dark:text-blue-200 mt-1">
                                        {formatDate(date)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <StatBox icon={Users} label="Tổng khách" value={tour.totalParticipants} color="indigo" />
                    <StatBox icon={CalendarCheck} label="Đã đặt" value={tour.bookingsCount} color="emerald" />
                    <StatBox icon={UserCheck} label="Tối đa" value={tour.maxParticipants} color="orange" />
                    <StatBox icon={CalendarDays} label="Tạo ngày" value={formatDate(tour.createdAt)} color="teal" />
                </div>

                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} relative`}>
                    {isSubmitting && (
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-2xl z-50 backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="animate-spin text-white" size={48} />
                                <p className="text-white font-medium text-lg">Đang cập nhật tour...</p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold">Chi Tiết Hành Trình</h3>
                        <button
                            onClick={() => setEditing(!editing)}
                            disabled={isSubmitting}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${editing ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {editing ? <><X size={18} /> Hủy</> : <><Edit2 size={18} /> Chỉnh sửa</>}
                        </button>
                    </div>

                    {editing ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Lịch trình chi tiết <span className="text-red-500">*</span></label>
                                <textarea
                                    rows={6}
                                    value={formData.itinerary}
                                    onChange={e => setFormData(prev => ({ ...prev, itinerary: e.target.value }))}
                                    className={`w-full px-4 py-3 rounded-xl border resize-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Điểm đón</label>
                                    <input
                                        type="text"
                                        value={formData.departurePoint}
                                        onChange={e => setFormData(prev => ({ ...prev, departurePoint: e.target.value }))}
                                        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Giờ khởi hành</label>
                                    <input
                                        type="text"
                                        value={formData.departureTime}
                                        onChange={e => setFormData(prev => ({ ...prev, departureTime: e.target.value }))}
                                        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Phù hợp với</label>
                                <input
                                    type="text"
                                    value={formData.suitableFor}
                                    onChange={e => setFormData(prev => ({ ...prev, suitableFor: e.target.value }))}
                                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-3">Phương tiện di chuyển</label>
                                <div className="space-y-3">
                                    {transports.map((t, i) => (
                                        <div key={i} className="flex gap-3 items-center">
                                            <input
                                                value={t.name}
                                                onChange={e => {
                                                    const newT = [...transports];
                                                    newT[i].name = e.target.value;
                                                    setTransports(newT);
                                                }}
                                                placeholder="Tên phương tiện"
                                                className={`flex-1 px-4 py-2 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                                            />
                                            <input
                                                type="number"
                                                value={t.price}
                                                onChange={e => {
                                                    const newT = [...transports];
                                                    newT[i].price = Number(e.target.value) || 0;
                                                    setTransports(newT);
                                                }}
                                                placeholder="Giá thêm"
                                                className={`w-32 px-4 py-2 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                                            />
                                            <button
                                                onClick={() => setTransports(prev => prev.filter((_, idx) => idx !== i))}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setTransports(prev => [...prev, { name: '', price: 0 }])}
                                        className="flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium"
                                    >
                                        <Plus size={18} /> Thêm phương tiện
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-3">Khách sạn sử dụng trong tour</label>
                                {selectedHotels.length > 0 && (
                                    <div className="space-y-3 mb-4">
                                        {selectedHotels.map(h => (
                                            <div key={h.id} className="flex items-center justify-between p-4 border rounded-xl bg-gray-50 dark:bg-gray-700">
                                                <div className="flex items-center gap-3">
                                                    <HotelIcon size={20} className="text-blue-600" />
                                                    <div>
                                                        <p className="font-medium">{h.name}</p>
                                                        <p className="text-sm text-gray-500">{h.address} • {h.starRating}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setSelectedHotels(prev => prev.filter(x => x.id !== h.id));
                                                        setSelectedHotelIds(prev => prev.filter(id => id !== h.id));
                                                    }}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <button
                                    onClick={() => setShowHotelModal(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
                                >
                                    <Plus size={18} /> Chọn khách sạn từ danh sách
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Chính sách hủy tour</label>
                                <textarea
                                    rows={4}
                                    value={formData.cancellationPolicy}
                                    onChange={e => setFormData(prev => ({ ...prev, cancellationPolicy: e.target.value }))}
                                    className={`w-full px-4 py-3 rounded-xl border resize-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Thêm ảnh phụ</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={e => setAdditionalImages(prev => [...prev, ...(e.target.files ? Array.from(e.target.files) : [])])}
                                    className="w-full px-4 py-3 rounded-xl border file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white"
                                />
                                {additionalImages.length > 0 && (
                                    <div className="grid grid-cols-4 gap-3 mt-4">
                                        {additionalImages.map((file, i) => (
                                            <div key={i} className="relative group">
                                                <img src={URL.createObjectURL(file)} alt="" className="w-full h-32 object-cover rounded-lg border" />
                                                <button
                                                    onClick={() => setAdditionalImages(prev => prev.filter((_, idx) => idx !== i))}
                                                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Thêm video giới thiệu</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="video/*"
                                    onChange={e => setVideos(prev => [...prev, ...(e.target.files ? Array.from(e.target.files) : [])])}
                                    className="w-full px-4 py-3 rounded-xl border file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white"
                                />
                                {videos.length > 0 && (
                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                        {videos.map((file, i) => (
                                            <div key={i} className="relative group">
                                                <video src={URL.createObjectURL(file)} className="w-full h-40 object-cover rounded-lg" controls />
                                                <button
                                                    onClick={() => setVideos(prev => prev.filter((_, idx) => idx !== i))}
                                                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleSubmitDetail}
                                disabled={isSubmitting}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8 text-sm">
                            <InfoRow label="Điểm đón" value={detail.departurePoint || 'Chưa có thông tin'} />
                            <InfoRow label="Giờ khởi hành" value={detail.departureTime || 'Chưa có thông tin'} />
                            <InfoRow label="Phù hợp với" value={detail.suitableFor || 'Chưa có thông tin'} />

                            <div>
                                <p className="font-semibold mb-2">Phương tiện di chuyển</p>
                                {detail.transports && detail.transports.length > 0 ? (
                                    <ul className="list-disc pl-6 space-y-1">
                                        {detail.transports.map((t, i) => (
                                            <li key={i}>
                                                {t.name} {t.price > 0 && <span className="text-green-600 font-medium">(+{formatCurrency(t.price)})</span>}
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-gray-500">Chưa có phương tiện</p>}
                            </div>

                            {detail.selectedHotels && detail.selectedHotels.length > 0 && (
                                <div>
                                    <p className="font-semibold mb-3">Khách sạn sử dụng</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {detail.selectedHotels.map(h => (
                                            <div key={h.id} className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-700">
                                                <h4 className="font-semibold text-lg">{h.name}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{h.address}</p>
                                                <p className="text-sm font-medium text-yellow-600">{h.starRating}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <p className="font-semibold mb-2">Lịch trình chi tiết</p>
                                <div className={`whitespace-pre-wrap ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {detail.itinerary || 'Chưa có lịch trình'}
                                </div>
                            </div>

                            <div>
                                <p className="font-semibold mb-2">Chính sách hủy tour</p>
                                <div className={`whitespace-pre-wrap ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {detail.cancellationPolicy || 'Chưa có chính sách'}
                                </div>
                            </div>

                            {detail.additionalImages && detail.additionalImages.length > 0 && (
                                <div>
                                    <p className="font-semibold mb-3">Ảnh phụ</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {detail.additionalImages.map((url, i) => (
                                            <div key={i} className="relative group cursor-pointer" onClick={() => openImageModal(url)}>
                                                <img src={url} alt="" className="w-full h-40 object-cover rounded-xl border hover:opacity-80 transition" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-xl transition">
                                                    <ZoomIn className="text-white" size={28} />
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); deleteImage(url); }}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {detail.videos && detail.videos.length > 0 && (
                                <div>
                                    <p className="font-semibold mb-3">Video giới thiệu</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {detail.videos.map((url, i) => (
                                            <div key={i} className="relative group">
                                                <video src={url} controls className="w-full h-64 object-cover rounded-xl" />
                                                <button
                                                    onClick={() => deleteVideoHandler(url)}
                                                    className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showHotelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className={`w-full max-w-5xl max-h-screen overflow-hidden rounded-2xl ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-2xl flex flex-col`}>
                        <div className="p-6 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Chọn khách sạn cho tour</h2>
                            <button onClick={() => setShowHotelModal(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto">
                            <div className="relative mb-6">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    type="text"
                                    value={hotelSearch}
                                    onChange={e => { setHotelSearch(e.target.value); setHotelPage(0); }}
                                    placeholder="Tìm kiếm khách sạn..."
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>

                            {loadingHotels ? (
                                <div className="flex justify-center py-16">
                                    <Loader2 className="animate-spin" size={48} />
                                </div>
                            ) : hotels.length === 0 ? (
                                <p className="text-center text-gray-500 py-16">Không tìm thấy khách sạn nào</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {hotels.map(hotel => {
                                        const isSelected = selectedHotelIds.includes(hotel.id);
                                        return (
                                            <div
                                                key={hotel.id}
                                                onClick={() => toggleHotel(hotel)}
                                                className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${isSelected
                                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 shadow-lg'
                                                    : theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                            >
                                                {hotelActionLoading && isSelected && (
                                                    <div className="absolute inset-0 bg-blue-600 bg-opacity-10 rounded-xl flex items-center justify-center z-10">
                                                        <Check className="text-blue-600 animate-ping" size={40} />
                                                    </div>
                                                )}

                                                {hotel.images.length > 0 && (
                                                    <img src={hotel.images[0]} alt={hotel.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                                                )}
                                                <h4 className="font-semibold text-lg">{hotel.name}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{hotel.address}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <p className="text-yellow-600 font-medium">{hotel.starRating}</p>
                                                    {isSelected && <Check className="text-blue-600" size={24} />}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {hotelTotalPages > 1 && (
                                <div className="flex justify-center items-center gap-6 mt-8">
                                    <button onClick={() => setHotelPage(p => Math.max(0, p - 1))} disabled={hotelPage === 0} className="p-2 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg">
                                        <ChevronLeft size={24} />
                                    </button>
                                    <span className="text-lg font-medium">Trang {hotelPage + 1} / {hotelTotalPages}</span>
                                    <button onClick={() => setHotelPage(p => Math.min(hotelTotalPages - 1, p + 1))} disabled={hotelPage === hotelTotalPages - 1} className="p-2 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg">
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-300 dark:border-gray-700 flex justify-end gap-4">
                            <button onClick={() => setShowHotelModal(false)} className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                                Hủy
                            </button>
                            <button
                                onClick={() => {
                                    handleSubmitDetail();
                                    setShowHotelModal(false);
                                }}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition flex items-center gap-2 shadow-lg"
                            >
                                <Check size={18} /> Xong ({selectedHotelIds.length} khách sạn)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ImagePreviewModal isOpen={showImageModal} imageUrl={imageModalUrl} onClose={() => setShowImageModal(false)} />
        </div>
    );
};

const InfoCard = ({ icon: Icon, label, value, color, bold = false }: { icon: any; label: string; value: string; color: string; bold?: boolean }) => {
    const { theme } = useTheme();
    return (
        <div className={`flex items-start gap-3 p-4 rounded-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-500`}>
                <Icon size={20} />
            </div>
            <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
                <p className={`font-medium ${bold ? 'text-lg font-bold' : ''} ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {value}
                </p>
            </div>
        </div>
    );
};

const StatBox = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: number | string; color: string }) => {
    const { theme } = useTheme();
    return (
        <div className={`text-center p-4 rounded-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`flex justify-center mb-2 text-${color}-500`}>
                <Icon size={22} />
            </div>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
            <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
    );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => {
    const { theme } = useTheme();
    return (
        <div>
            <p className="font-semibold mb-1">{label}</p>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{value}</p>
        </div>
    );
};

export default TourDetailPage;