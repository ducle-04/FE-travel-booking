import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MapPin,
    Calendar,
    Users,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2,
    Search,
    Eye,
    Star,
    Send,
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    fetchMyBookings,
    requestCancelBooking,
} from '../../services/bookingService';
import { canReviewTour, createReview } from '../../services/reviewService';
import type { Booking, BookingPage, BookingStatus } from '../../services/bookingService';

const MyToursPage: React.FC = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
    const [showCancelModal, setShowCancelModal] = useState<Booking | null>(null);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelLoading, setCancelLoading] = useState(false);

    // === REVIEW STATES ===
    const [showReviewModal, setShowReviewModal] = useState<Booking | null>(null);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewStatusCache, setReviewStatusCache] = useState<Record<number, 'can' | 'done' | 'loading'>>({});

    const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');

    // === ĐƯA checkCanReview LÊN TRÊN TRƯỚC KHI DÙNG ===
    const checkCanReview = useCallback(async (tourId: number): Promise<boolean> => {
        if (reviewStatusCache[tourId]) {
            return reviewStatusCache[tourId] === 'can';
        }

        setReviewStatusCache(prev => ({ ...prev, [tourId]: 'loading' }));

        try {
            const can = await canReviewTour(tourId);
            const status = can ? 'can' : 'done';
            setReviewStatusCache(prev => ({ ...prev, [tourId]: status }));
            return can;
        } catch {
            setReviewStatusCache(prev => ({ ...prev, [tourId]: 'done' }));
            return false;
        }
    }, [reviewStatusCache]);

    // === BÂY GIỜ MỚI DÙNG ===
    useEffect(() => {
        const completedBookings = bookings.filter(b => b.status === 'COMPLETED');
        completedBookings.forEach(b => {
            if (!reviewStatusCache[b.tourId]) {
                checkCanReview(b.tourId);
            }
        });
    }, [bookings, checkCanReview, reviewStatusCache]);

    const loadBookings = useCallback(
        async (pageNum: number = 0, filterStatus?: BookingStatus[]) => {
            if (!token) {
                toast.error('Vui lòng đăng nhập để xem tour đã đặt.');
                navigate('/login');
                return;
            }

            setLoading(true);
            try {
                const data: BookingPage = await fetchMyBookings(pageNum, filterStatus);
                setBookings(data.content);
                setTotalPages(data.totalPages || 1);
                setPage(pageNum);
            } catch (err: any) {
                if (err.response?.status === 401) {
                    localStorage.removeItem('jwtToken');
                    sessionStorage.removeItem('jwtToken');
                    toast.error('Phiên đăng nhập hết hạn');
                    navigate('/login');
                } else {
                    toast.error('Không thể tải danh sách tour');
                }
            } finally {
                setLoading(false);
            }
        },
        [token, navigate]
    );

    useEffect(() => {
        loadBookings(0);
    }, [loadBookings]);

    useEffect(() => {
        const filter = statusFilter === 'ALL' ? undefined : [statusFilter];
        loadBookings(0, filter);
    }, [statusFilter]);

    const filteredBookings = useMemo(() => {
        if (!searchTerm.trim()) return bookings;
        const term = searchTerm.toLowerCase();
        return bookings.filter(b =>
            b.tourName.toLowerCase().includes(term) ||
            b.destinationName.toLowerCase().includes(term) ||
            b.contactPhone.includes(term) ||
            b.contactEmail.toLowerCase().includes(term)
        );
    }, [bookings, searchTerm]);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('vi-VN');

    const colors = {
        yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        green: 'bg-green-100 text-green-800 border-green-200',
        red: 'bg-red-100 text-red-800 border-red-200',
        orange: 'bg-orange-100 text-orange-800 border-orange-200',
        gray: 'bg-gray-100 text-gray-800 border-gray-200',
        blue: 'bg-blue-100 text-blue-800 border-blue-200',
    } as const;

    type ColorKey = keyof typeof colors;

    const statusConfig = {
        PENDING: { color: 'yellow' as ColorKey, label: 'Chờ xác nhận', icon: Clock },
        CONFIRMED: { color: 'green' as ColorKey, label: 'Đã xác nhận', icon: CheckCircle },
        REJECTED: { color: 'red' as ColorKey, label: 'Bị từ chối', icon: XCircle },
        CANCEL_REQUEST: { color: 'orange' as ColorKey, label: 'Đang hủy', icon: AlertCircle },
        CANCELLED: { color: 'gray' as ColorKey, label: 'Đã hủy', icon: XCircle },
        COMPLETED: { color: 'blue' as ColorKey, label: 'Hoàn thành', icon: CheckCircle },
        DELETED: { color: 'gray' as ColorKey, label: 'Đã xóa', icon: XCircle },
    } satisfies Record<BookingStatus, { color: ColorKey; label: string; icon: any }>;

    const getStatusBadge = (status: BookingStatus) => {
        const config = statusConfig[status] ?? statusConfig.PENDING;
        const { color, label, icon: Icon } = config;

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${colors[color]}`}>
                <Icon className="w-3.5 h-3.5" />
                {label}
            </span>
        );
    };

    const handleCancelRequest = async () => {
        if (!showCancelModal) return;
        setCancelLoading(true);
        try {
            const updated = await requestCancelBooking(showCancelModal.id, cancelReason);
            setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
            toast.success('Đã gửi yêu cầu hủy thành công!');
            setShowCancelModal(null);
            setCancelReason('');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Gửi yêu cầu thất bại');
        } finally {
            setCancelLoading(false);
        }
    };

    const goToDetail = (bookingId: number) => {
        navigate(`/my-tours/${bookingId}`);
    };

    const handleSubmitReview = async () => {
        if (!showReviewModal?.tourId || reviewRating < 1) {
            toast.error('Vui lòng chọn số sao');
            return;
        }

        setReviewLoading(true);
        try {
            await createReview(showReviewModal.tourId, {
                rating: reviewRating,
                comment: reviewComment.trim() || undefined
            });
            toast.success('Cảm ơn bạn đã đánh giá!');
            setShowReviewModal(null);
            setReviewRating(0);
            setReviewComment('');
            setReviewStatusCache(prev => ({ ...prev, [showReviewModal.tourId]: 'done' }));
            loadBookings(page, statusFilter === 'ALL' ? undefined : [statusFilter]);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Gửi đánh giá thất bại');
        } finally {
            setReviewLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-cyan-600 mx-auto mb-4" />
                    <p className="text-slate-600">Đang tải tour của bạn...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-14">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900">Tour đã đặt</h1>
                    <p className="text-slate-600 mt-2">Quản lý và theo dõi các chuyến đi của bạn</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm tour, điểm đến, email, số điện thoại..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="px-5 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                        >
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="PENDING">Chờ xác nhận</option>
                            <option value="CONFIRMED">Đã xác nhận</option>
                            <option value="CANCEL_REQUEST">Đang yêu cầu hủy</option>
                            <option value="CANCELLED">Đã hủy</option>
                            <option value="COMPLETED">Hoàn thành</option>
                            <option value="REJECTED">Bị từ chối</option>
                        </select>
                    </div>
                </div>

                {/* Booking List */}
                <div className="space-y-6">
                    {filteredBookings.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-xl font-medium text-slate-600">Bạn chưa đặt tour nào</p>
                            <button
                                onClick={() => navigate('/tours')}
                                className="mt-6 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-medium transition"
                            >
                                Khám phá tour ngay
                            </button>
                        </div>
                    ) : (
                        filteredBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                                        <MapPin className="w-5 h-5 text-cyan-600" />
                                                        {booking.tourName}
                                                    </h3>
                                                    <p className="text-slate-600">{booking.destinationName}</p>
                                                </div>
                                                {getStatusBadge(booking.status)}
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{formatDate(booking.selectedStartDate)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Users className="w-4 h-4" />
                                                    <span>{booking.numberOfPeople} người</span>
                                                </div>
                                                <div className="flex items-center gap-2 font-semibold text-slate-900">
                                                    <DollarSign className="w-4 h-4 text-green-600" />
                                                    <span>{formatCurrency(booking.totalPrice)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-500 text-xs">
                                                    <Clock className="w-4 h-4" />
                                                    <span>Đặt: {formatDate(booking.bookingDate)}</span>
                                                </div>
                                            </div>

                                            {booking.note && (
                                                <p className="mt-3 text-sm italic text-slate-600 bg-slate-50 px-4 py-2 rounded-lg">
                                                    Ghi chú: "{booking.note}"
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-row lg:flex-col gap-3 justify-end">
                                            <button
                                                onClick={() => goToDetail(booking.id)}
                                                className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-medium transition whitespace-nowrap"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Xem chi tiết
                                            </button>

                                            {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                                                <button
                                                    onClick={() => setShowCancelModal(booking)}
                                                    className="flex items-center gap-2 px-5 py-2.5 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 font-medium transition whitespace-nowrap"
                                                >
                                                    <AlertCircle className="w-4 h-4" />
                                                    Hủy tour
                                                </button>
                                            )}

                                            {/* === NÚT ĐÁNH GIÁ / ĐÃ ĐÁNH GIÁ === */}
                                            {booking.status === 'COMPLETED' && (
                                                <>
                                                    {reviewStatusCache[booking.tourId] === 'loading' ? (
                                                        <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-600 rounded-lg font-medium whitespace-nowrap">
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            Đang kiểm tra...
                                                        </div>
                                                    ) : reviewStatusCache[booking.tourId] === 'can' ? (
                                                        <button
                                                            onClick={async () => {
                                                                const can = await checkCanReview(booking.tourId);
                                                                if (can) {
                                                                    setShowReviewModal(booking);
                                                                }
                                                            }}
                                                            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition whitespace-nowrap"
                                                        >
                                                            <Star className="w-4 h-4" />
                                                            Đánh giá
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-600 rounded-lg font-medium whitespace-nowrap">
                                                            <CheckCircle className="w-4 h-4" />
                                                            Đã đánh giá
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-3 mt-10">
                        <button
                            onClick={() => loadBookings(page - 1, statusFilter === 'ALL' ? undefined : [statusFilter])}
                            disabled={page === 0}
                            className="px-6 py-3 border rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                        >
                            Trước
                        </button>
                        <span className="px-6 py-3 font-medium text-slate-700">
                            Trang {page + 1} / {totalPages}
                        </span>
                        <button
                            onClick={() => loadBookings(page + 1, statusFilter === 'ALL' ? undefined : [statusFilter])}
                            disabled={page >= totalPages - 1}
                            className="px-6 py-3 border rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                        >
                            Sau
                        </button>
                    </div>
                )}
            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Xác nhận hủy tour</h3>
                        <p className="text-slate-600 mb-6">
                            Bạn có chắc chắn muốn hủy booking <strong>#{showCancelModal.id}</strong> - {showCancelModal.tourName}?
                        </p>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Lý do hủy (khuyến khích)
                            </label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Ví dụ: Thay đổi lịch trình, lý do cá nhân..."
                                rows={4}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelRequest}
                                disabled={cancelLoading}
                                className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-70 transition flex items-center justify-center gap-2"
                            >
                                {cancelLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                                {cancelLoading ? 'Đang gửi...' : 'Gửi yêu cầu hủy'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowCancelModal(null);
                                    setCancelReason('');
                                }}
                                className="flex-1 border border-slate-300 py-3 rounded-lg font-medium hover:bg-slate-50 transition"
                            >
                                Quay lại
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* === REVIEW MODAL === */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Đánh giá tour</h3>
                        <p className="text-slate-600 mb-6">
                            <strong>{showReviewModal.tourName}</strong> - {showReviewModal.destinationName}
                        </p>

                        {/* Sao đánh giá */}
                        <div className="flex gap-2 mb-5 justify-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setReviewRating(star)}
                                    className={`transition-all ${reviewRating >= star ? 'text-yellow-500 scale-110' : 'text-gray-300'
                                        } hover:text-yellow-400`}
                                    disabled={reviewLoading}
                                >
                                    <Star className="w-10 h-10 fill-current" />
                                </button>
                            ))}
                        </div>

                        {/* Bình luận */}
                        <textarea
                            placeholder="Chia sẻ trải nghiệm của bạn... (tùy chọn)"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows={4}
                            maxLength={2000}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none mb-4"
                            disabled={reviewLoading}
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={handleSubmitReview}
                                disabled={reviewLoading || reviewRating === 0}
                                className={`flex-1 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${reviewRating === 0
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-purple-600 text-white hover:bg-purple-700'
                                    }`}
                            >
                                {reviewLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                                {reviewLoading ? 'Đang gửi...' : 'Gửi đánh giá'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowReviewModal(null);
                                    setReviewRating(0);
                                    setReviewComment('');
                                }}
                                className="flex-1 border border-slate-300 py-3 rounded-lg font-medium hover:bg-slate-50 transition"
                                disabled={reviewLoading}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyToursPage;