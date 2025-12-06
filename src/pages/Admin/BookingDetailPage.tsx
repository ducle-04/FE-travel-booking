import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
    Clock, MapPin, Users, Calendar, DollarSign,
    XCircle, User, Phone, Mail,
    MessageSquare, ChevronLeft, Loader2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
    confirmBooking,
    rejectBooking,
    approveCancellation,
    rejectCancellation,
    completeBooking,
    softDeleteBooking
} from '../../services/bookingService';
import { axiosInstance } from '../../services/bookingService';
import type { Booking } from '../../services/bookingService';
import PaymentSection from '../../components/Layout/DefautLayout/AdminLayout/Booking/PaymentSection';

const AdminBookingDetailPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || "0";
    const { id } = useParams<{ id: string }>();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [reason, setReason] = useState('');

    useEffect(() => {
        const fetchBooking = async () => {
            if (!id) return;
            try {
                const res = await axiosInstance.get(`/bookings/${id}`);
                setBooking(res.data.data);
            } catch (err: any) {
                toast.error(err.response?.data?.message || 'Không tải được booking');
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [id]);

    const handleAction = async (action: () => Promise<Booking | void>) => {
        setActionLoading(true);
        try {
            const result = await action();
            if (result && 'id' in result) {
                setBooking(result as Booking);
                toast.success('Thao tác thành công!');
            } else {
                toast.success('Thao tác thành công!');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Thao tác thất bại');
        } finally {
            setActionLoading(false);
        }
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const formatDate = (d: string) => new Date(d).toLocaleDateString('vi-VN');
    const formatDateTime = (d: string) => new Date(d).toLocaleString('vi-VN');

    const getStatusBadge = (status: Booking['status']) => {
        const map: Record<Booking['status'], { bg: string; text: string; label: string }> = {
            PENDING: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-300', label: 'Chờ xác nhận' },
            CONFIRMED: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', label: 'Đã xác nhận' },
            REJECTED: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300', label: 'Đã từ chối' },
            CANCEL_REQUEST: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-800 dark:text-orange-300', label: 'Yêu cầu hủy' },
            CANCELLED: { bg: 'bg-gray-200 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-300', label: 'Đã hủy' },
            COMPLETED: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300', label: 'Hoàn thành' },
            DELETED: { bg: 'bg-gray-300 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-400', label: 'Đã xóa' },
        };

        if (!status || !map[status]) {
            return (
                <span className="px-4 py-1.5 rounded-lg font-medium text-sm bg-gray-300 text-gray-700">
                    Không xác định
                </span>
            );
        }

        const { bg, text, label } = map[status];
        return <span className={`px-4 py-1.5 rounded-lg font-medium text-sm ${bg} ${text}`}>{label}</span>;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="animate-spin w-12 h-12 text-purple-600" />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <XCircle size={56} className="mx-auto text-red-500 mb-3" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Không tìm thấy booking</h2>
                    <Link to={`/admin/bookings?page=${page}`} className="mt-3 inline-block text-purple-600 hover:text-purple-700 font-medium">
                        ← Quay lại danh sách
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
            <div className="max-w-6xl mx-auto">

                {/* Back Button */}
                <Link
                    to={`/admin/bookings?page=${page}`}
                    className="inline-flex items-center gap-1.5 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium mb-6 transition-colors"
                >
                    <ChevronLeft size={18} /> Quay lại
                </Link>

                {/* Main Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-6">

                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Đặt lúc: {formatDateTime(booking.bookingDate)}
                                </p>
                            </div>
                            <div>{getStatusBadge(booking.status)}</div>
                        </div>

                        {/* Customer + Tour Info */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                            {/* Customer */}
                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-5 border border-gray-100 dark:border-gray-700">
                                <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                    <User size={18} /> Khách hàng
                                </h3>
                                <div className="flex items-center gap-4">
                                    {booking.userAvatarUrl ? (
                                        <img src={booking.userAvatarUrl} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600" />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-xl font-bold text-purple-600 dark:text-purple-400 border-2 border-purple-200 dark:border-purple-800">
                                            {(booking.userFullname || booking.contactName || '?')[0].toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                                            {booking.userFullname || booking.contactName}
                                        </p>
                                        {booking.guest && <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">• Khách chưa đăng ký tài khoản</span>}
                                        <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                            <p className="flex items-center gap-1.5"><Phone size={14} /> {booking.userPhone || booking.contactPhone}</p>
                                            <p className="flex items-center gap-1.5 truncate"><Mail size={14} /> {booking.contactEmail}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tour */}
                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-5 border border-gray-100 dark:border-gray-700">
                                <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                    <MapPin size={18} /> Tour
                                </h3>
                                <h4 className="text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100">{booking.tourName}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{booking.destinationName}</p>
                                {booking.selectedTransportName && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            <span className="font-medium">Phương tiện:</span> {booking.selectedTransportName}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            Phụ phí: {formatCurrency(booking.selectedTransportPrice || 0)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                            {[
                                { icon: Calendar, label: 'Khởi hành', value: formatDate(booking.selectedStartDate), color: 'text-blue-600 dark:text-blue-400' },
                                { icon: Users, label: 'Số người', value: `${booking.numberOfPeople} người`, color: 'text-green-600 dark:text-green-400' },
                                { icon: DollarSign, label: 'Tổng tiền', value: formatCurrency(booking.totalPrice), color: 'text-purple-600 dark:text-purple-400' },
                                { icon: Clock, label: 'Đặt lúc', value: formatDateTime(booking.bookingDate).split(',')[0], color: 'text-orange-600 dark:text-orange-400' },
                            ].map((item, i) => (
                                <div key={i} className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                                    <item.icon className={`w-6 h-6 mb-2 ${item.color}`} />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Note */}
                        {booking.note && (
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                                <div className="flex gap-3">
                                    <MessageSquare className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">Ghi chú từ khách</p>
                                        <p className="text-sm text-amber-800 dark:text-amber-300 italic">"{booking.note}"</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payment Section */}
                        {booking.paymentMethod && (
                            <div className="mb-6">
                                <PaymentSection
                                    booking={booking}
                                    onUpdate={(updated: Booking) => setBooking(updated)}
                                    axiosInstance={axiosInstance}
                                />
                            </div>
                        )}

                        {/* Actions */}
                        <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-5 text-center">Hành động quản trị</h3>

                            {actionLoading && (
                                <div className="flex justify-center py-6">
                                    <Loader2 className="animate-spin text-purple-600 w-8 h-8" />
                                </div>
                            )}

                            <div className="max-w-2xl mx-auto space-y-4">

                                {/* PENDING Actions */}
                                {booking.status === 'PENDING' && (
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => handleAction(() => confirmBooking(booking.id))}
                                            disabled={actionLoading}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60"
                                        >
                                            Xác nhận booking
                                        </button>

                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <label className="block text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">
                                                Lý do từ chối <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                placeholder="Nhập lý do từ chối booking..."
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                rows={4}
                                                className="w-full rounded-lg border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500 transition
                                                    bg-white dark:bg-gray-900 
                                                    border-gray-300 dark:border-gray-600 
                                                    text-gray-900 dark:text-gray-100 
                                                    placeholder-gray-400 dark:placeholder-gray-500"
                                            />
                                            <button
                                                onClick={() => handleAction(() => rejectBooking(booking.id, reason))}
                                                disabled={actionLoading || !reason.trim()}
                                                className={`mt-3 w-full py-3 rounded-lg font-semibold transition
                                                    ${reason.trim()
                                                        ? 'bg-red-600 hover:bg-red-700 text-white'
                                                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                                    } disabled:opacity-60`}
                                            >
                                                Từ chối booking
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* CANCEL_REQUEST Actions */}
                                {booking.status === 'CANCEL_REQUEST' && (
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => handleAction(() => approveCancellation(booking.id))}
                                            disabled={actionLoading}
                                            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition"
                                        >
                                            Đồng ý hủy tour
                                        </button>

                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <label className="block text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">
                                                Lý do từ chối yêu cầu hủy <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                placeholder="Giải thích lý do không cho hủy tour..."
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                rows={4}
                                                className="w-full rounded-lg border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                                                    bg-white dark:bg-gray-900 
                                                    border-gray-300 dark:border-gray-600 
                                                    text-gray-900 dark:text-gray-100 
                                                    placeholder-gray-400 dark:placeholder-gray-500"
                                            />
                                            <button
                                                onClick={() => handleAction(() => rejectCancellation(booking.id, reason))}
                                                disabled={actionLoading || !reason.trim()}
                                                className={`mt-3 w-full py-3 rounded-lg font-semibold transition
                                                    ${reason.trim()
                                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                                    } disabled:opacity-60`}
                                            >
                                                Từ chối yêu cầu hủy
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* CONFIRMED Action */}
                                {booking.status === 'CONFIRMED' && (
                                    <button
                                        onClick={() => handleAction(() => completeBooking(booking.id))}
                                        disabled={actionLoading}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                                    >
                                        Đánh dấu hoàn thành tour
                                    </button>
                                )}

                                {/* Delete Action */}
                                {(booking.status === 'REJECTED' || booking.status === 'CANCELLED') && (
                                    <button
                                        onClick={() => handleAction(() => softDeleteBooking(booking.id))}
                                        disabled={actionLoading}
                                        className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition"
                                    >
                                        Xóa vĩnh viễn
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBookingDetailPage;