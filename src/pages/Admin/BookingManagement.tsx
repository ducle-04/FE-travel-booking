import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Clock,
    Trash2,
    Calendar,
    User,
    MapPin,
    DollarSign,
    Loader2,
} from 'lucide-react';
import {
    fetchPendingBookings,
    confirmBooking,
    rejectBooking,
    approveCancellation,
    rejectCancellation,
    completeBooking,
    softDeleteBooking,
} from '../../services/bookingService';

import type { Booking, BookingPage, BookingStatus } from '../../services/bookingService';

const BookingManagement: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [actionReason, setActionReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // Load bookings với filter status từ backend
    const loadBookings = useCallback(
        async (pageNum: number, filterStatus?: BookingStatus[]) => {
            setLoading(true);
            setError(null);
            try {
                const data: BookingPage = await fetchPendingBookings(pageNum, filterStatus);
                setBookings(data.content);
                setTotalPages(data.totalPages);
                setPage(pageNum);
            } catch (err: any) {
                setError(err.message || 'Lỗi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Tự động reload khi thay đổi filter status
    useEffect(() => {
        const filterStatuses = statusFilter === 'ALL' ? undefined : [statusFilter];
        loadBookings(0, filterStatuses);
    }, [statusFilter, loadBookings]);

    // Tải trang đầu khi mount
    useEffect(() => {
        loadBookings(0);
    }, [loadBookings]);

    // Lọc client-side (tìm kiếm)
    const filteredBookings = useMemo(() => {
        return bookings.filter((booking) => {
            const matchesSearch =
                booking.userFullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.userPhone.includes(searchTerm);
            return matchesSearch;
        });
    }, [bookings, searchTerm]);

    // Actions
    const handleConfirm = async (id: number) => {
        setActionLoading(true);
        try {
            const updated = await confirmBooking(id);
            setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
            setShowModal(false);
        } catch (err: any) {
            alert(err.message || 'Lỗi xác nhận');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (id: number) => {
        if (!actionReason.trim()) return alert('Vui lòng nhập lý do');
        setActionLoading(true);
        try {
            const updated = await rejectBooking(id, actionReason);
            setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
            setActionReason('');
            setShowModal(false);
        } catch (err: any) {
            alert(err.message || 'Lỗi từ chối');
        } finally {
            setActionLoading(false);
        }
    };

    const handleApproveCancellation = async (id: number) => {
        setActionLoading(true);
        try {
            const updated = await approveCancellation(id);
            setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
            setShowModal(false);
        } catch (err: any) {
            alert(err.message || 'Lỗi đồng ý hủy');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectCancellation = async (id: number) => {
        if (!actionReason.trim()) return alert('Vui lòng nhập lý do');
        setActionLoading(true);
        try {
            const updated = await rejectCancellation(id, actionReason);
            setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
            setActionReason('');
            setShowModal(false);
        } catch (err: any) {
            alert(err.message || 'Lỗi từ chối hủy');
        } finally {
            setActionLoading(false);
        }
    };

    const handleComplete = async (id: number) => {
        setActionLoading(true);
        try {
            const updated = await completeBooking(id);
            setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
            setShowModal(false);
        } catch (err: any) {
            alert(err.message || 'Lỗi hoàn thành');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Xóa booking này?')) return;
        setActionLoading(true);
        try {
            await softDeleteBooking(id);
            setBookings((prev) => prev.filter((b) => b.id !== id));
            setShowModal(false);
        } catch (err: any) {
            alert(err.message || 'Lỗi xóa');
        } finally {
            setActionLoading(false);
        }
    };

    // Format
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('vi-VN');
    const formatDateTime = (dateStr: string) => new Date(dateStr).toLocaleString('vi-VN');

    // Status badge
    const getStatusBadge = (status: BookingStatus) => {
        const badges: Record<
            BookingStatus,
            { bg: string; text: string; label: string }
        > = {
            PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Chờ xác nhận' },
            CONFIRMED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Đã xác nhận' },
            REJECTED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Đã từ chối' },
            CANCEL_REQUEST: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Yêu cầu hủy' },
            CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Đã hủy' },
            COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Hoàn thành' },
            DELETED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Đã xóa' },
        };
        const { bg, text, label } = badges[status];
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>
                {label}
            </span>
        );
    };

    // Stats (từ dữ liệu đã lọc)
    const stats = useMemo(() => ({
        pending: bookings.filter((b) => b.status === 'PENDING').length,
        confirmed: bookings.filter((b) => b.status === 'CONFIRMED').length,
        cancelRequested: bookings.filter((b) => b.status === 'CANCEL_REQUEST').length,
        completed: bookings.filter((b) => b.status === 'COMPLETED').length,
    }), [bookings]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Quản Lý Booking Tour
                    </h1>
                    <p className="text-gray-600">
                        Theo dõi và xử lý các đơn đặt tour du lịch
                    </p>
                </div>

                {/* Loading & Error */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                        <span className="ml-2 text-gray-600">Đang tải...</span>
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Stats */}
                {!loading && !error && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-yellow-600 font-medium">
                                            Chờ xác nhận
                                        </p>
                                        <p className="text-2xl font-bold text-yellow-700">
                                            {stats.pending}
                                        </p>
                                    </div>
                                    <Clock className="text-yellow-500" size={32} />
                                </div>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-green-600 font-medium">
                                            Đã xác nhận
                                        </p>
                                        <p className="text-2xl font-bold text-green-700">
                                            {stats.confirmed}
                                        </p>
                                    </div>
                                    <CheckCircle className="text-green-500" size={32} />
                                </div>
                            </div>
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-orange-600 font-medium">
                                            Yêu cầu hủy
                                        </p>
                                        <p className="text-2xl font-bold text-orange-700">
                                            {stats.cancelRequested}
                                        </p>
                                    </div>
                                    <XCircle className="text-orange-500" size={32} />
                                </div>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-600 font-medium">
                                            Hoàn thành
                                        </p>
                                        <p className="text-2xl font-bold text-blue-700">
                                            {stats.completed}
                                        </p>
                                    </div>
                                    <Calendar className="text-blue-500" size={32} />
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm tên, tour, SĐT..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Filter size={20} className="text-gray-400" />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(e.target.value as BookingStatus | 'ALL')
                                        }
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="ALL">Tất cả</option>
                                        <option value="PENDING">Chờ xác nhận</option>
                                        <option value="CONFIRMED">Đã xác nhận</option>
                                        <option value="CANCEL_REQUEST">Yêu cầu hủy</option>
                                        <option value="CANCELLED">Đã hủy</option>
                                        <option value="REJECTED">Đã từ chối</option>
                                        <option value="COMPLETED">Hoàn thành</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                #
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Khách hàng
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Tour
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Ngày đi
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Số người
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Tổng tiền
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Trạng thái
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredBookings.map((booking, index) => {
                                            const stt = page * 10 + index + 1;
                                            return (
                                                <tr key={booking.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {stt}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex-shrink-0">
                                                                {booking.userAvatarUrl ? (
                                                                    <img
                                                                        src={booking.userAvatarUrl}
                                                                        alt={booking.userFullname}
                                                                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                                    />
                                                                ) : (
                                                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                        <User size={16} className="text-gray-500" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {booking.userFullname}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {booking.userPhone}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-start gap-2">
                                                            <MapPin size={16} className="text-gray-400 mt-1" />
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {booking.tourName}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {booking.destinationName}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatDate(booking.startDate)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {booking.numberOfPeople} người
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                                                            <DollarSign size={14} />
                                                            {formatCurrency(booking.totalPrice)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(booking.status)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedBooking(booking);
                                                                setShowModal(true);
                                                            }}
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            Chi tiết
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                                    <button
                                        onClick={() => {
                                            const filterStatuses =
                                                statusFilter === 'ALL' ? undefined : [statusFilter];
                                            loadBookings(page - 1, filterStatuses);
                                        }}
                                        disabled={page === 0}
                                        className="px-3 py-1 text-sm rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Trước
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Trang {page + 1} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => {
                                            const filterStatuses =
                                                statusFilter === 'ALL' ? undefined : [statusFilter];
                                            loadBookings(page + 1, filterStatuses);
                                        }}
                                        disabled={page === totalPages - 1}
                                        className="px-3 py-1 text-sm rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Sau
                                    </button>
                                </div>
                            )}

                            {filteredBookings.length === 0 && !loading && (
                                <div className="text-center py-12 text-gray-500">
                                    Không tìm thấy booking nào
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Modal */}
            {showModal && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Chi tiết Booking #{selectedBooking.id}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setActionReason('');
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <XCircle size={24} />
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <label className="text-sm font-medium text-gray-500 w-32">
                                            Khách hàng
                                        </label>
                                        <div className="flex items-center gap-3">
                                            {selectedBooking.userAvatarUrl ? (
                                                <img
                                                    src={selectedBooking.userAvatarUrl}
                                                    alt={selectedBooking.userFullname}
                                                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <User size={20} className="text-gray-500" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-gray-900 font-medium">
                                                    {selectedBooking.userFullname}
                                                </p>
                                                <p className="text-sm text-gray-500">{selectedBooking.userPhone}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Trạng thái
                                        </label>
                                        <div className="mt-1">
                                            {getStatusBadge(selectedBooking.status)}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Tour</label>
                                    <p className="text-gray-900 font-medium">
                                        {selectedBooking.tourName}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Điểm đến
                                    </label>
                                    <p className="text-gray-900">{selectedBooking.destinationName}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Ngày đi
                                        </label>
                                        <p className="text-gray-900">
                                            {formatDate(selectedBooking.startDate)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Số người
                                        </label>
                                        <p className="text-gray-900">
                                            {selectedBooking.numberOfPeople} người
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Tổng tiền
                                    </label>
                                    <p className="text-xl font-bold text-gray-900">
                                        {formatCurrency(selectedBooking.totalPrice)}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Thời gian đặt
                                    </label>
                                    <p className="text-gray-900">
                                        {formatDateTime(selectedBooking.bookingDate)}
                                    </p>
                                </div>

                                {selectedBooking.note && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Ghi chú
                                        </label>
                                        <p className="text-gray-900 italic">
                                            "{selectedBooking.note}"
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                {actionLoading && (
                                    <div className="flex justify-center py-2">
                                        <Loader2 className="animate-spin text-blue-600" size={20} />
                                    </div>
                                )}

                                {selectedBooking.status === 'PENDING' && (
                                    <>
                                        <button
                                            onClick={() => handleConfirm(selectedBooking.id)}
                                            disabled={actionLoading}
                                            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <CheckCircle size={20} />
                                            Xác nhận booking
                                        </button>
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Lý do từ chối..."
                                                value={actionReason}
                                                onChange={(e) => setActionReason(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-red-500"
                                            />
                                            <button
                                                onClick={() => handleReject(selectedBooking.id)}
                                                disabled={actionLoading}
                                                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                <XCircle size={20} />
                                                Từ chối booking
                                            </button>
                                        </div>
                                    </>
                                )}

                                {selectedBooking.status === 'CANCEL_REQUEST' && (
                                    <>
                                        <button
                                            onClick={() =>
                                                handleApproveCancellation(selectedBooking.id)
                                            }
                                            disabled={actionLoading}
                                            className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <CheckCircle size={20} />
                                            Đồng ý hủy tour
                                        </button>
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Lý do từ chối hủy..."
                                                value={actionReason}
                                                onChange={(e) => setActionReason(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                onClick={() =>
                                                    handleRejectCancellation(selectedBooking.id)
                                                }
                                                disabled={actionLoading}
                                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                <XCircle size={20} />
                                                Từ chối yêu cầu hủy
                                            </button>
                                        </div>
                                    </>
                                )}

                                {selectedBooking.status === 'CONFIRMED' && (
                                    <button
                                        onClick={() => handleComplete(selectedBooking.id)}
                                        disabled={actionLoading}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <CheckCircle size={20} />
                                        Đánh dấu hoàn thành
                                    </button>
                                )}

                                {(selectedBooking.status === 'REJECTED' ||
                                    selectedBooking.status === 'CANCELLED') && (
                                        <button
                                            onClick={() => handleDelete(selectedBooking.id)}
                                            disabled={actionLoading}
                                            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <Trash2 size={20} />
                                            Xóa booking
                                        </button>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingManagement;