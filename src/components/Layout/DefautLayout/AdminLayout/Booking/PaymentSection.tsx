import React from 'react';
import { DollarSign, CreditCard, CheckCircle, Link2 } from 'lucide-react';
import { updatePaymentStatus } from '../../../../../services/bookingService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'; // ← Chỉ dùng để confirm đẹp, không thay toast
import type { Booking } from '../../../../../services/bookingService';

interface Props {
    booking: Booking;
    onUpdate: (updated: Booking) => void;
    axiosInstance: any;
    theme?: 'light' | 'dark';
}

const PaymentSection: React.FC<Props> = ({ booking, onUpdate, axiosInstance, theme = 'light' }) => {

    const getPaymentMethodBadge = (method?: string) => {
        if (!method) return null;
        return method === 'DIRECT'
            ? <div className="flex items-center gap-1 text-indigo-400"><DollarSign size={18} /> Trực tiếp</div>
            : <div className="flex items-center gap-1 text-pink-400"><CreditCard size={18} /> MoMo</div>;
    };

    const getPaymentStatusBadge = (status?: string) => {
        const map = {
            PENDING: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Chờ thanh toán' },
            PAID: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Đã thanh toán' },
            FAILED: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Thất bại' },
            CANCELLED: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Đã hủy' },
        };
        const item = map[status as keyof typeof map] || map.PENDING;
        return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.bg} ${item.text} border border-current/30`}>{item.label}</span>;
    };

    const formatDateTime = (d: string) => new Date(d).toLocaleString('vi-VN');

    const recreateMomoLink = async () => {
        const result = await Swal.fire({
            title: 'Tạo lại link MoMo?',
            text: 'Bạn có chắc muốn tạo lại link thanh toán?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Tạo lại',
            cancelButtonText: 'Hủy',
            reverseButtons: true,
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
        });

        if (!result.isConfirmed) return;

        try {
            const res = await axiosInstance.post(`/payments/momo/create/${booking.id}`);
            window.open(res.data.data, '_blank');
            toast.success('Đã tạo lại link MoMo thành công!');
        } catch {
            toast.error('Không thể tạo lại link MoMo');
        }
    };

    const markAsPaid = async () => {
        const result = await Swal.fire({
            title: 'Đánh dấu đã thanh toán?',
            html: `
                <div class="text-left space-y-2">
                    <p>Bạn chắc chắn muốn đánh dấu booking này là <strong class="text-green-500">ĐÃ THANH TOÁN</strong>?</p>
                    <p class="text-sm">Mã booking: <strong>#${booking.id}</strong></p>
                    ${booking.tourName ? `<p class="text-sm">Tour: <strong>${booking.tourName}</strong></p>` : ''}
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đã nhận tiền',
            cancelButtonText: 'Hủy',
            reverseButtons: true,
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
            customClass: {
                confirmButton: 'bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg',
                cancelButton: 'bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg ml-3',
            },
            buttonsStyling: false,
        });

        if (!result.isConfirmed) return;

        try {
            const updated = await updatePaymentStatus(booking.id, 'PAID');
            onUpdate({ ...booking, ...updated });
            toast.success('Đã cập nhật thanh toán!');
        } catch {
            toast.error('Cập nhật thất bại');
        }
    };

    return (
        <div className="p-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl border border-emerald-500/30">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <DollarSign className="text-emerald-400" size={24} />
                Quản lý thanh toán
            </h3>

            <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                    <p className="text-sm text-gray-400">Phương thức</p>
                    <div className="mt-1 font-semibold text-lg">
                        {getPaymentMethodBadge(booking.paymentMethod)}
                    </div>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Trạng thái</p>
                    <div className="mt-1">
                        {getPaymentStatusBadge(booking.paymentStatus)}
                        {booking.paidAt && <p className="text-xs text-gray-500 mt-1">{formatDateTime(booking.paidAt)}</p>}
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
                {booking.paymentStatus !== 'PAID' && booking.paymentMethod === 'DIRECT' && (
                    <button
                        onClick={markAsPaid}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition hover:scale-105"
                    >
                        <CheckCircle size={20} />
                        Đánh dấu ĐÃ THANH TOÁN
                    </button>
                )}

                {booking.paymentMethod === 'MOMO' && booking.paymentStatus === 'PENDING' && (
                    <button
                        onClick={recreateMomoLink}
                        className="flex-1 flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-bold transition hover:scale-105"
                    >
                        <Link2 size={20} />
                        Tạo lại link MoMo
                    </button>
                )}
            </div>
        </div>
    );
};

export default PaymentSection;