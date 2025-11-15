import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Users,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2,
    User,
    Search,
    Filter,
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    fetchMyBookings,
    requestCancelBooking,
} from '../../services/bookingService';
import type { Booking, BookingPage, BookingStatus } from '../../services/bookingService';

const MyToursPage: React.FC = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
    const [showCancelModal, setShowCancelModal] = useState<Booking | null>(null);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelLoading, setCancelLoading] = useState(false);

    const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');

    const loadBookings = useCallback(
        async (pageNum: number, filterStatus?: BookingStatus[]) => {
            if (!token) {
                toast.error('Vui lòng đăng nhập để xem booking.', { position: 'top-right' });
                navigate('/login');
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const data: BookingPage = await fetchMyBookings(pageNum, filterStatus);
                setBookings(data.content);
                setTotalPages(data.totalPages);
                setPage(pageNum);
            } catch (err: any) {
                if (err.message.includes('401') || err.response?.status === 401) {
                    toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
                    localStorage.removeItem('jwtToken');
                    sessionStorage.removeItem('jwtToken');
                    navigate('/login');
                } else {
                    setError(err.message || 'Không thể tải danh sách booking.');
                    toast.error(err.message || 'Lỗi tải dữ liệu');
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
        const filterStatuses = statusFilter === 'ALL' ? undefined : [statusFilter];
        loadBookings(0, filterStatuses);
    }, [statusFilter]);

    const filteredBookings = useMemo(() => {
        return bookings.filter((booking) => {
            const matchesSearch =
                booking.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.destinationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.userPhone.includes(searchTerm);
            return matchesSearch;
        });
    }, [bookings, searchTerm]);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('vi-VN');

    const getStatusBadge = (status: BookingStatus) => {
        const badges: Record<
            BookingStatus,
            { bg: string; text: string; icon: React.ReactNode; label: string }
        > = {
            PENDING: {
                bg: 'bg-yellow-100 border-yellow-200',
                text: 'text-yellow-800',
                icon: <Clock className="w-3 h-3" />,
                label: 'Chờ xác nhận',
            },
            CONFIRMED: {
                bg: 'bg-green-100 border-green-200',
                text: 'text-green-800',
                icon: <CheckCircle className="w-3 h-3" />,
                label: 'Đã xác nhận',
            },
            REJECTED: {
                bg: 'bg-red-100 border-red-200',
                text: 'text-red-800',
                icon: <XCircle className="w-3 h-3" />,
                label: 'Bị từ chối',
            },
            CANCEL_REQUEST: {
                bg: 'bg-orange-100 border-orange-200',
                text: 'text-orange-800',
                icon: <AlertCircle className="w-3 h-3" />,
                label: 'Yêu cầu hủy',
            },
            CANCELLED: {
                bg: 'bg-gray-100 border-gray-200',
                text: 'text-gray-800',
                icon: <XCircle className="w-3 h-3" />,
                label: 'Đã hủy',
            },
            COMPLETED: {
                bg: 'bg-blue-100 border-blue-200',
                text: 'text-blue-800',
                icon: <CheckCircle className="w-3 h-3" />,
                label: 'Hoàn thành',
            },
            DELETED: {
                bg: 'bg-gray-100 border-gray-200',
                text: 'text-gray-800',
                icon: <XCircle className="w-3 h-3" />,
                label: 'Đã xóa',
            },
        };
        const { bg, text, icon, label } = badges[status];
        return (
            <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${bg} ${text}`}
            >
                {icon}
                {label}
            </span>
        );
    };

    const handleCancelRequest = async () => {
        if (!showCancelModal) return;
        setCancelLoading(true);
        try {
            const updated = await requestCancelBooking(showCancelModal.id, cancelReason);
            setBookings((prev) =>
                prev.map((b) => (b.id === updated.id ? updated : b))
            );
            toast.success('Đã gửi yêu cầu hủy tour thành công!');
            setShowCancelModal(null);
            setCancelReason('');
        } catch (err: any) {
            toast.error(err.message || 'Gửi yêu cầu hủy thất bại');
        } finally {
            setCancelLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center items-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
                    </div>
                    <p className="text-slate-600 font-medium">Đang tải tour đã đặt...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="mb-8 mt-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200 mb-4 group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Quay lại
                    </button>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Tour đã đặt</h1>
                    <p className="text-slate-600">Theo dõi lịch sử đặt tour của bạn</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg p-6 mb-6 border border-slate-200 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm tour, điểm đến, SĐT..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-slate-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as BookingStatus | 'ALL')}
                                className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            >
                                <option value="ALL">Tất cả trạng thái</option>
                                <option value="PENDING">Chờ xác nhận</option>
                                <option value="CONFIRMED">Đã xác nhận</option>
                                <option value="CANCEL_REQUEST">Yêu cầu hủy</option>
                                <option value="CANCELLED">Đã hủy</option>
                                <option value="REJECTED">Bị từ chối</option>
                                <option value="COMPLETED">Hoàn thành</option>
                            </select>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Booking Cards */}
                <div className="space-y-6">
                    {filteredBookings.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-10 h-10 text-slate-400" />
                            </div>
                            <p className="text-slate-600 font-medium">Bạn chưa đặt tour nào</p>
                            <button
                                onClick={() => navigate('/tours')}
                                className="mt-4 text-cyan-600 hover:text-cyan-700 font-medium"
                            >
                                Khám phá tour ngay
                            </button>
                        </div>
                    ) : (
                        filteredBookings.map((booking, index) => {
                            const stt = page * 10 + index + 1;
                            return (
                                <div
                                    key={booking.id}
                                    className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Avatar + Info */}
                                        <div className="flex items-start gap-4 flex-shrink-0">
                                            <div className="text-slate-500 text-sm font-medium">#{stt}</div>
                                            <div className="flex-shrink-0">
                                                {booking.userAvatarUrl ? (
                                                    <img
                                                        src={booking.userAvatarUrl}
                                                        alt={booking.userFullname}
                                                        className="w-14 h-14 rounded-full object-cover border border-slate-200"
                                                    />
                                                ) : (
                                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                                                        <User className="w-6 h-6 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{booking.userFullname}</p>
                                                <p className="text-sm text-slate-500">{booking.userPhone}</p>
                                            </div>
                                        </div>

                                        {/* Tour Info */}
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                                    <MapPin className="w-5 h-5 text-cyan-600" />
                                                    {booking.tourName}
                                                </h3>
                                                <p className="text-slate-600 ml-7">{booking.destinationName}</p>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Calendar className="w-4 h-4 text-slate-400" />
                                                    <span>{formatDate(booking.startDate)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Users className="w-4 h-4 text-slate-400" />
                                                    <span>{booking.numberOfPeople} người</span>
                                                </div>
                                                <div className="flex items-center gap-1 font-semibold text-slate-900">
                                                    <DollarSign className="w-4 h-4 text-green-600" />
                                                    <span>{formatCurrency(booking.totalPrice)}</span>
                                                </div>
                                            </div>

                                            {booking.note && (
                                                <p className="text-sm text-slate-600 italic">Ghi chú: "{booking.note}"</p>
                                            )}
                                        </div>

                                        {/* Status + Action */}
                                        <div className="flex flex-col items-end justify-between">
                                            <div>{getStatusBadge(booking.status)}</div>
                                            <p className="text-xs text-slate-500 mt-2">
                                                Đặt ngày: {formatDate(booking.bookingDate)}
                                            </p>

                                            {/* Nút hủy nếu được phép */}
                                            {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                                                <button
                                                    onClick={() => setShowCancelModal(booking)}
                                                    className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                                                >
                                                    <AlertCircle className="w-4 h-4" />
                                                    Yêu cầu hủy tour
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button
                            onClick={() => {
                                const filterStatuses = statusFilter === 'ALL' ? undefined : [statusFilter];
                                loadBookings(page - 1, filterStatuses);
                            }}
                            disabled={page === 0}
                            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Trước
                        </button>
                        <span className="text-slate-600 font-medium">
                            Trang {page + 1} / {totalPages}
                        </span>
                        <button
                            onClick={() => {
                                const filterStatuses = statusFilter === 'ALL' ? undefined : [statusFilter];
                                loadBookings(page + 1, filterStatuses);
                            }}
                            disabled={page === totalPages - 1}
                            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Sau
                        </button>
                    </div>
                )}
            </div>

            {/* Modal hủy booking */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">
                            Yêu cầu hủy tour
                        </h3>
                        <p className="text-slate-600 mb-4">
                            Bạn có chắc muốn hủy booking <strong>#{showCancelModal.id}</strong>?
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Lý do hủy <span className="text-xs text-slate-500">(tùy chọn)</span>
                            </label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Nhập lý do hủy tour..."
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                                rows={3}
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelRequest}
                                disabled={cancelLoading}
                                className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                            >
                                {cancelLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Đang gửi...
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-4 h-4" />
                                        Gửi yêu cầu
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    setShowCancelModal(null);
                                    setCancelReason('');
                                }}
                                className="flex-1 border border-slate-300 text-slate-700 py-2 px-4 rounded-lg font-medium hover:bg-slate-50 transition-colors"
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