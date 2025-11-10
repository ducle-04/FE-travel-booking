import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, MapPin, Clock, DollarSign, Star, Users, CalendarCheck,
    UserCheck, CalendarDays, Edit2, X, Play, ZoomIn, Trash2
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import ImagePreviewModal from '../../components/Layout/DefautLayout/AdminLayout/DestinationManagement/ImagePreviewModal';
import {
    fetchTourDetail,
    updateTourDetail,
    deleteAdditionalImage,
    deleteVideo as deleteVideoService
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
    tourDetail?: TourDetail;
}

interface TourDetail {
    transportation: string;
    itinerary: string;
    departurePoint: string;
    departureTime: string;
    suitableFor: string;
    cancellationPolicy: string;
    additionalImages: string[];
    videos: string[];
}

const TourDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { theme } = useTheme();

    const [tour, setTour] = useState<Tour | null>(null);
    const [detail, setDetail] = useState<TourDetail>({
        transportation: '',
        itinerary: '',
        departurePoint: '',
        departureTime: '',
        suitableFor: '',
        cancellationPolicy: '',
        additionalImages: [],
        videos: []
    });
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<TourDetail>>({});
    const [additionalImages, setAdditionalImages] = useState<File[]>([]);
    const [videos, setVideos] = useState<File[]>([]);
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageModalUrl, setImageModalUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken') || '';

    const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    const formatDate = (date: string) => new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    useEffect(() => {
        if (id) fetchTourDetailData();
    }, [id]);

    const fetchTourDetailData = async () => {
        setLoading(true);
        try {
            const tourData = await fetchTourDetail(id!);
            setTour(tourData);
            const fetchedDetail = tourData.tourDetail || {
                transportation: '',
                itinerary: '',
                departurePoint: '',
                departureTime: '',
                suitableFor: '',
                cancellationPolicy: '',
                additionalImages: [],
                videos: []
            };
            setDetail(fetchedDetail);
            setFormData(fetchedDetail);
        } catch (error: any) {
            toast.error(error.message || 'Không thể tải chi tiết tour');
            navigate('/admin/tours');
        } finally {
            setLoading(false);
        }
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
            await updateTourDetail(token, id, formData, additionalImages, videos);
            toast.success('Cập nhật chi tiết tour thành công!');
            setEditing(false);
            setAdditionalImages([]);
            setVideos([]);
            fetchTourDetailData();
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
                fetchTourDetailData();
            } catch (error: any) {
                toast.error(error.message || 'Xóa ảnh thất bại');
            }
        }
    };

    const deleteVideo = async (videoUrl: string) => {
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
                await deleteVideoService(token, id, videoUrl);
                toast.success('Xóa video thành công');
                fetchTourDetailData();
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

                {/* Header */}
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

                {/* Ảnh chính */}
                <div className="relative rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-600">
                    <img
                        src={tour.imageUrl}
                        alt={tour.name}
                        className="w-full h-80 object-cover"
                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/1200x400?text=Ảnh+Tour'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                        <h1 className="text-4xl font-bold drop-shadow-lg">{tour.name}</h1>
                        <span className={`inline-block mt-2 px-4 py-1.5 rounded-full text-sm font-medium ${tour.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-500'}`}>
                            {tour.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm dừng'}
                        </span>
                    </div>
                </div>

                {/* Thông tin chính */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <InfoCard icon={MapPin} label="Điểm đến" value={tour.destinationName} color="blue" />
                    <InfoCard icon={Clock} label="Thời gian" value={tour.duration} color="green" />
                    <InfoCard icon={DollarSign} label="Giá tour" value={formatCurrency(tour.price)} color="purple" bold />
                    <InfoCard icon={Star} label="Đánh giá" value={`${tour.averageRating}/5 (${tour.reviewsCount} lượt)`} color="yellow" />
                </div>

                {/* Mô tả */}
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <h3 className="text-xl font-semibold mb-3">Mô tả tour</h3>
                    <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {tour.description || 'Chưa có mô tả chi tiết.'}
                    </p>
                </div>

                {/* Thống kê */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <StatBox icon={Users} label="Tổng khách" value={tour.totalParticipants} color="indigo" />
                    <StatBox icon={CalendarCheck} label="Đã đặt" value={tour.bookingsCount} color="emerald" />
                    <StatBox icon={UserCheck} label="Tối đa" value={tour.maxParticipants} color="orange" />
                    <StatBox icon={CalendarDays} label="Tạo ngày" value={formatDate(tour.createdAt)} color="teal" />
                </div>

                {/* CHI TIẾT TOUR */}
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} relative`}>
                    {isSubmitting && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-2xl z-10">
                            <div className="flex flex-col items-center gap-3">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-white"></div>
                                <p className="text-white font-medium">Đang cập nhật...</p>
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
                        <div className="space-y-5">
                            {[
                                { key: 'transportation' as const, label: 'Phương tiện di chuyển', type: 'text' as const },
                                { key: 'departurePoint' as const, label: 'Điểm đón', type: 'text' as const },
                                { key: 'departureTime' as const, label: 'Giờ khởi hành', type: 'text' as const },
                                { key: 'suitableFor' as const, label: 'Phù hợp với', type: 'text' as const },
                                { key: 'itinerary' as const, label: 'Lịch trình chi tiết', type: 'textarea' as const },
                                { key: 'cancellationPolicy' as const, label: 'Chính sách hủy tour', type: 'textarea' as const },
                            ].map(field => (
                                <div key={field.key}>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                        {field.label} <span className="text-red-500">*</span>
                                    </label>
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            rows={5}
                                            value={formData[field.key] || ''}
                                            onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                                            disabled={isSubmitting}
                                            className={`w-full px-4 py-3 rounded-xl border resize-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={formData[field.key] || ''}
                                            onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                                            disabled={isSubmitting}
                                            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        />
                                    )}
                                </div>
                            ))}

                            {/* Upload nhiều ảnh */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Thêm ảnh phụ (nhiều ảnh)</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={e => setAdditionalImages(prev => [...prev, ...(e.target.files ? Array.from(e.target.files) : [])])}
                                    disabled={isSubmitting}
                                    className={`w-full px-4 py-3 rounded-xl border file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white file:bg-blue-600 file:text-white' : 'bg-white border-gray-300 text-gray-900 file:bg-blue-600 file:text-white'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                                {additionalImages.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {additionalImages.map((file, i) => (
                                            <div key={i} className="relative group">
                                                <img src={URL.createObjectURL(file)} alt={`preview-${i}`} className="w-24 h-24 object-cover rounded-lg border" />
                                                <button
                                                    onClick={() => setAdditionalImages(prev => prev.filter((_, idx) => idx !== i))}
                                                    disabled={isSubmitting}
                                                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Upload nhiều video */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Thêm video (nhiều video)</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="video/*"
                                    onChange={e => setVideos(prev => [...prev, ...(e.target.files ? Array.from(e.target.files) : [])])}
                                    disabled={isSubmitting}
                                    className={`w-full px-4 py-3 rounded-xl border file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white file:bg-blue-600 file:text-white' : 'bg-white border-gray-300 text-gray-900 file:bg-blue-600 file:text-white'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                                {videos.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {videos.map((file, i) => (
                                            <div key={i} className="relative group w-32 h-24 bg-gray-900 rounded-lg overflow-hidden">
                                                <video src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                                    <Play className="text-white" size={32} />
                                                </div>
                                                <button
                                                    onClick={() => setVideos(prev => prev.filter((_, idx) => idx !== i))}
                                                    disabled={isSubmitting}
                                                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Nút lưu */}
                            <button
                                onClick={handleSubmitDetail}
                                disabled={isSubmitting}
                                className={`w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                        Đang lưu...
                                    </div>
                                ) : (
                                    'Lưu Thay Đổi'
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6 text-sm">
                            <InfoRow label="Phương tiện" value={detail.transportation || 'Chưa có'} />
                            <InfoRow label="Điểm đón" value={detail.departurePoint || 'Chưa có'} />
                            <InfoRow label="Giờ khởi hành" value={detail.departureTime || 'Chưa có'} />
                            <InfoRow label="Phù hợp với" value={detail.suitableFor || 'Chưa có'} />

                            <div>
                                <p className="font-semibold mb-1">Lịch trình chi tiết</p>
                                <p className={`whitespace-pre-wrap ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {detail.itinerary || 'Chưa có lịch trình'}
                                </p>
                            </div>

                            <div>
                                <p className="font-semibold mb-1">Chính sách hủy tour</p>
                                <p className={`whitespace-pre-wrap ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {detail.cancellationPolicy || 'Chưa có chính sách'}
                                </p>
                            </div>

                            {detail.additionalImages && detail.additionalImages.length > 0 && (
                                <div>
                                    <p className="font-semibold mb-3">Ảnh phụ</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {detail.additionalImages.map((url, i) => (
                                            <div
                                                key={i}
                                                className="relative group cursor-pointer"
                                                onClick={() => openImageModal(url)}
                                            >
                                                <img
                                                    src={url}
                                                    alt={`Ảnh phụ ${i + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg border hover:opacity-80 transition"
                                                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=IMG'; }}
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-lg">
                                                    <ZoomIn className="text-white" size={24} />
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); deleteImage(url); }}
                                                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {detail.videos && detail.videos.length > 0 && (
                                <div>
                                    <p className="font-semibold mb-3">Video giới thiệu</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {detail.videos.map((url, i) => (
                                            <div key={i} className="relative group">
                                                <a href={url} target="_blank" rel="noopener noreferrer" className="block">
                                                    <video src={url} className="w-full h-48 object-cover rounded-lg" controls />
                                                </a>
                                                <button
                                                    onClick={() => deleteVideo(url)}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <Trash2 size={16} />
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

            <ImagePreviewModal isOpen={showImageModal} imageUrl={imageModalUrl} onClose={() => setShowImageModal(false)} />
        </div>
    );
};

// Component con
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