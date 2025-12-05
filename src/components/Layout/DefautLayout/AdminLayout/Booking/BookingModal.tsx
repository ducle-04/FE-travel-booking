import React, { useState } from 'react';
import { XCircle, CheckCircle, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import {
    confirmBooking,
    rejectBooking,
    approveCancellation,
    rejectCancellation,
    completeBooking,
    softDeleteBooking,
} from '../../../../../services/bookingService';
import type { Booking } from '../../../../../services/bookingService';
import PaymentSection from './PaymentSection';

interface Props {
    booking: Booking | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updated: Booking) => void;
    axiosInstance: any;
    theme: 'light' | 'dark';
}

const BookingModal: React.FC<Props> = ({ booking, isOpen, onClose, onUpdate, axiosInstance, theme }) => {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !booking) return null;

    const handleAction = async (action: () => Promise<Booking | void>) => {
        setLoading(true);
        try {
            const result = await action();
            if (result && 'id' in result) {
                onUpdate(result as Booking);
            } else {
                onClose();
            }
            toast.success('Thao tác thành công!');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Thao tác thất bại');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const formatDate = (d: string) => new Date(d).toLocaleDateString('vi-VN');
    const formatDateTime = (d: string) => new Date(d).toLocaleString('vi-VN');

    // ⭐⭐ BADGE CÓ NỀN THEME DARK/LIGHT ⭐⭐
    const getStatusBadge = (status: Booking['status'], theme: 'light' | 'dark') => {
        const isDark = theme === 'dark';

        const map: Record<Booking['status'], { bg: string; text: string; label: string }> = {
            PENDING: {
                bg: 'bg-yellow-500/20',
                text: isDark ? 'text-yellow-300' : 'text-yellow-600',
                label: 'Chờ xác nhận'
            },
            CONFIRMED: {
                bg: 'bg-green-500/20',
                text: isDark ? 'text-green-300' : 'text-green-600',
                label: 'Đã xác nhận'
            },
            REJECTED: {
                bg: 'bg-red-500/20',
                text: isDark ? 'text-red-300' : 'text-red-600',
                label: 'Đã từ chối'
            },
            CANCEL_REQUEST: {
                bg: 'bg-orange-500/20',
                text: isDark ? 'text-orange-300' : 'text-orange-600',
                label: 'Yêu cầu hủy'
            },
            CANCELLED: {
                bg: isDark ? 'bg-white/20' : 'bg-gray-500/20',   // ⭐ nền sáng khi dark
                text: isDark ? 'text-white' : 'text-gray-600',    // ⭐ chữ trắng khi dark
                label: 'Đã hủy'
            },
            COMPLETED: {
                bg: 'bg-blue-500/20',
                text: isDark ? 'text-blue-300' : 'text-blue-600',
                label: 'Hoàn thành'
            },
            DELETED: {
                bg: isDark ? 'bg-white/10' : 'bg-gray-600/30',
                text: isDark ? 'text-gray-300' : 'text-gray-600',
                label: 'Đã xóa'
            }
        };

        const { bg, text, label } = map[status];

        return (
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${bg} ${text} border border-current/30`}>
                {label}
            </span>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className={`rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>

                <div className="p-8">
                    {/* Header */}
                    <div className={`flex justify-between items-center mb-8 pb-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                            <XCircle size={32} />
                        </button>
                    </div>

                    {/* User + Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <label className={`block text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Khách hàng
                            </label>

                            <div className="flex items-center gap-5">
                                {booking.userAvatarUrl ? (
                                    <img
                                        src={booking.userAvatarUrl}
                                        alt="Avatar"
                                        className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-gray-600">
                                            {(booking.userFullname || booking.contactName || '?')[0].toUpperCase()}
                                        </span>
                                    </div>
                                )}

                                <div>
                                    <p className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                                        {booking.userFullname || booking.contactName}
                                    </p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {booking.userPhone || booking.contactPhone}
                                    </p>
                                    {booking.contactEmail && (
                                        <p className="text-sm text-blue-500">{booking.contactEmail}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <label className={`block text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Trạng thái
                            </label>

                            {/* ⭐ CHỖ NÀY GỌI BADGE MỚI ⭐ */}
                            {getStatusBadge(booking.status, theme)}
                        </div>
                    </div>

                    {/* Tour Info */}
                    <div className="space-y-8">
                        <div>
                            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                                {booking.tourName}
                            </p>
                            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {booking.destinationName}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-400">Ngày khởi hành</p>
                                <p className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                                    {formatDate(booking.selectedStartDate)}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400">Số người</p>
                                <p className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                                    {booking.numberOfPeople} người
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400">Tổng tiền</p>
                                <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                                    {formatCurrency(booking.totalPrice)}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400">Ngày đặt</p>
                                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {formatDateTime(booking.bookingDate)}
                                </p>
                            </div>
                        </div>

                        {/* Ghi chú */}
                        {booking.note && (
                            <div>
                                <p className="text-sm text-gray-400 mb-2">Ghi chú của khách</p>
                                <p className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl italic">
                                    "{booking.note}"
                                </p>
                            </div>
                        )}

                        {/* PAYMENT SECTION */}
                        {booking.paymentMethod && (
                            <PaymentSection
                                booking={booking}
                                theme={theme}
                                onUpdate={onUpdate}
                                axiosInstance={axiosInstance}
                            />
                        )}

                        {/* ACTION BUTTONS */}
                        <div className="mt-10 space-y-4">
                            {loading && (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="animate-spin text-purple-500" size={32} />
                                </div>
                            )}

                            {/* PENDING */}
                            {booking.status === 'PENDING' && (
                                <>
                                    <button
                                        onClick={() => handleAction(() => confirmBooking(booking.id))}
                                        disabled={loading}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-60"
                                    >
                                        <CheckCircle size={28} /> Xác nhận booking
                                    </button>

                                    <div>
                                        <textarea
                                            placeholder="Nhập lý do từ chối..."
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            rows={4}
                                            className={`w-full p-4 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'} rounded-xl focus:ring-2 focus:ring-red-500 mb-3`}
                                        />
                                        <button
                                            onClick={() => handleAction(() => rejectBooking(booking.id, reason))}
                                            disabled={loading || !reason.trim()}
                                            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-60"
                                        >
                                            <XCircle size={28} /> Từ chối booking
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* CANCEL_REQUEST */}
                            {booking.status === 'CANCEL_REQUEST' && (
                                <>
                                    <button
                                        onClick={() => handleAction(() => approveCancellation(booking.id))}
                                        disabled={loading}
                                        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-60"
                                    >
                                        <CheckCircle size={28} /> Đồng ý hủy tour
                                    </button>

                                    <div>
                                        <textarea
                                            placeholder="Lý do từ chối yêu cầu hủy..."
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            rows={4}
                                            className={`w-full p-4 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 mb-3`}
                                        />
                                        <button
                                            onClick={() => handleAction(() => rejectCancellation(booking.id, reason))}
                                            disabled={loading || !reason.trim()}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-60"
                                        >
                                            <XCircle size={28} /> Từ chối yêu cầu hủy
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* CONFIRMED */}
                            {booking.status === 'CONFIRMED' && (
                                <button
                                    onClick={() => handleAction(() => completeBooking(booking.id))}
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3"
                                >
                                    <CheckCircle size={28} /> Đánh dấu hoàn thành tour
                                </button>
                            )}

                            {/* REJECTED, CANCELLED ⇒ Xóa vĩnh viễn */}
                            {(booking.status === 'REJECTED' || booking.status === 'CANCELLED') && (
                                <button
                                    onClick={() => handleAction(() => softDeleteBooking(booking.id))}
                                    disabled={loading}
                                    className="w-full bg-gray-600 hover:bg-gray-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3"
                                >
                                    <Trash2 size={28} /> Xóa vĩnh viễn
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
