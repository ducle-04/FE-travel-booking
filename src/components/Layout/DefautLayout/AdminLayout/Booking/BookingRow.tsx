// src/components/Layout/DefautLayout/AdminLayout/Booking/BookingRow.tsx
import React from 'react';
import { User, MapPin, DollarSign, CreditCard, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom'; // THÊM DÒNG NÀY
import type { Booking, BookingStatus } from '../../../../../services/bookingService';

interface Props {
    booking: Booking;
    index: number;
    page: number;
    theme: 'light' | 'dark';
    onOpenModal: (booking: Booking) => void;
    onDelete: (id: number) => void;
}

const BookingRow: React.FC<Props> = ({ booking, index, page, theme, onOpenModal, onDelete }) => {
    const stt = page * 10 + index + 1;

    const getStatusBadge = (status: BookingStatus) => {
        const map: Record<BookingStatus, { bg: string; text: string; label: string }> = {
            PENDING: { bg: 'bg-yellow-500/20', text: 'text-yellow-600', label: 'Chờ xác nhận' },
            CONFIRMED: { bg: 'bg-green-500/20', text: 'text-green-600', label: 'Đã xác nhận' },
            REJECTED: { bg: 'bg-red-500/20', text: 'text-red-600', label: 'Đã từ chối' },
            CANCEL_REQUEST: { bg: 'bg-orange-500/20', text: 'text-orange-600', label: 'Yêu cầu hủy' },
            CANCELLED: { bg: 'bg-gray-500/20', text: 'text-gray-600', label: 'Đã hủy' },
            COMPLETED: { bg: 'bg-blue-500/20', text: 'text-blue-600', label: 'Hoàn thành' },
            DELETED: { bg: 'bg-gray-600/30', text: 'text-gray-500', label: 'Đã xóa' },
        };

        const { bg, text, label } = map[status];

        return (
            <span className={`inline-flex items-center px-5 py-2 rounded-full font-semibold text-sm ${bg} ${text} border border-current/20`}>
                {label}
            </span>
        );
    };

    const getPaymentMethodBadge = (method?: string) => {
        if (!method) return <span className="text-gray-500">—</span>;
        return method === 'DIRECT'
            ? <div className="flex items-center gap-1 text-indigo-400"><DollarSign size={16} /> Trực tiếp</div>
            : <div className="flex items-center gap-1 text-pink-400"><CreditCard size={16} /> MoMo</div>;
    };

    const getPaymentStatusBadge = (status?: string) => {
        if (!status) return <span className="text-gray-500 text-xs">Chưa có</span>;
        const map = {
            PENDING: { bg: 'bg-yellow-500/20', text: 'text-yellow-600', label: 'Chờ thanh toán' },
            PAID: { bg: 'bg-green-500/20', text: 'text-green-600', label: 'Đã thanh toán' },
            FAILED: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Thất bại' },
            CANCELLED: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Đã hủy' },
        };
        const item = map[status as keyof typeof map] || map.PENDING;
        return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.bg} ${item.text} border border-current/30`}>{item.label}</span>;
    };

    const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    const formatDate = (d: string) => new Date(d).toLocaleDateString('vi-VN');
    const formatDateTime = (d: string) => new Date(d).toLocaleString('vi-VN');

    return (
        <tr className={`hover:${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} transition`}>
            <td className={`px-6 py-5 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>{stt}</td>

            {/* Khách hàng */}
            <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden border-2 border-gray-600">
                        {booking.userAvatarUrl ? (
                            <img src={booking.userAvatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <User size={24} className="text-gray-500" />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className={`font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                            {booking.userFullname || booking.contactName || 'Khách lẻ'}
                        </div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {booking.userPhone || booking.contactPhone}
                        </div>
                    </div>
                </div>
            </td>

            {/* SỬA CHỖ NÀY: Tên tour thành link */}
            <td className="px-6 py-5">
                <Link
                    to={`/tours/${booking.tourId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-medium hover:text-purple-600 hover:underline flex items-center gap-1 transition ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}
                >
                    {booking.tourName}
                    <ExternalLink size={14} className="opacity-60" />
                </Link>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-1 mt-1`}>
                    <MapPin size={14} /> {booking.destinationName}
                </div>
            </td>

            {/* Các cột còn lại giữ nguyên */}
            <td className={`px-6 py-5 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>{formatDate(booking.selectedStartDate)}</td>
            <td className={`px-6 py-5 text-center font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{booking.numberOfPeople}</td>
            <td className={`px-6 py-5 font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                {formatCurrency(booking.totalPrice)}
            </td>
            <td className="px-6 py-5 text-sm">{getPaymentMethodBadge(booking.paymentMethod)}</td>
            <td className="px-6 py-5">
                <div className="flex flex-col gap-1">
                    {getPaymentStatusBadge(booking.paymentStatus)}
                    {booking.paidAt && <span className="text-xs text-gray-500">{formatDateTime(booking.paidAt)}</span>}
                </div>
            </td>
            <td className="px-6 py-5">{getStatusBadge(booking.status)}</td>

            {/* Thao tác */}
            <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onOpenModal(booking)}
                        className="text-purple-600 hover:text-purple-800 font-medium"
                    >
                        Xử lý
                    </button>
                    {(booking.status === 'REJECTED' || booking.status === 'CANCELLED' || booking.status === 'DELETED') && (
                        <button
                            onClick={() => onDelete(booking.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Xóa vĩnh viễn"
                        >
                            <Trash2 size={19} />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default BookingRow;