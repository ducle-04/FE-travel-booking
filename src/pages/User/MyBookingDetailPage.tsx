import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    CalendarDays,
    Users,
    Wallet,
    Clock,
    UserCheck,
    PhoneCall,
    Mail,
    FileText,
    CheckCircle2,
    Plane,
    Car,
    Hotel,
    Camera,
    AlertCircle,
    Coffee,
    Sun,
    CloudRain,
    Loader2,
    XCircle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchBookingDetail } from '../../services/bookingService';
import type { Booking } from '../../services/bookingService';

const MyBookingDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (!id) return;
            try {
                const data = await fetchBookingDetail(Number(id));
                setBooking(data);
            } catch (err: any) {
                toast.error('Không tải được thông tin booking');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const formatDate = (d: string) => new Date(d).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const getStatusConfig = (status: Booking['status']) => {
        const map = {
            PENDING: { color: 'from-amber-400 to-orange-500', label: 'Đang chờ xác nhận', icon: Clock },
            CONFIRMED: { color: 'from-emerald-400 to-teal-600', label: 'Đã xác nhận • Sắp đi thôi!', icon: CheckCircle2 },
            CANCEL_REQUEST: { color: 'from-orange-400 to-red-500', label: 'Đang xử lý hủy', icon: AlertCircle },
            CANCELLED: { color: 'from-gray-400 to-gray-600', label: 'Đã hủy', icon: XCircle },
            COMPLETED: { color: 'from-purple-400 to-pink-600', label: 'Hoàn thành • Kỷ niệm đẹp!', icon: Camera },
            REJECTED: { color: 'from-red-400 to-rose-600', label: 'Bị từ chối', icon: XCircle },
            DELETED: { color: 'from-gray-500 to-gray-700', label: 'Đã xóa', icon: FileText },
        };
        return map[status] || map.PENDING;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-teal-600 mx-auto mb-6" />
                    <p className="text-xl text-gray-700">Đang chuẩn bị hành trình cho bạn...</p>
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 flex items-center justify-center p-6">
                <div className="bg-white/80 backdrop-blur rounded-3xl p-12 text-center">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-14 h-14 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Oops! Không tìm thấy booking</h2>
                    <Link to="/my-tours" className="text-teal-600 hover:text-teal-700 font-semibold">
                        ← Quay lại danh sách tour
                    </Link>
                </div>
            </div>
        );
    }

    const status = getStatusConfig(booking.status);
    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/my-tours');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-8 px-4 pt-24">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-800 font-medium mb-8 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
                    Quay lại
                </button>

                {/* Layout 2 cột */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Cột trái - Thông tin chính */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header Card */}
                        <div className="bg-white/90 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/50">
                            <div className={`bg-gradient-to-r ${status.color} p-6 text-white relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-black/10"></div>
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between flex-wrap gap-4">
                                        <div>
                                            <p className="text-white/90 text-sm mb-1">Mã đặt tour</p>
                                            <h1 className="text-3xl font-bold"># {booking.id}</h1>
                                            <h2 className="text-xl font-semibold mt-2 opacity-95">{booking.tourName}</h2>
                                            <p className="text-base mt-1 opacity-90 flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                {booking.destinationName}
                                            </p>
                                        </div>
                                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full">
                                            <status.icon className="w-6 h-6" />
                                            <span className="text-base font-bold">{status.label}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trip Info - Ngang */}
                        <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-white/50 p-6">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-gradient-to-br from-teal-50 to-cyan-100 rounded-2xl p-4 border border-teal-200">
                                    <CalendarDays className="w-8 h-8 text-teal-600 mb-2" />
                                    <p className="text-xs text-teal-700 font-medium">Ngày khởi hành</p>
                                    <p className="text-lg font-bold text-teal-900">{formatDate(booking.selectedStartDate)}</p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-4 border border-purple-200">
                                    <Users className="w-8 h-8 text-purple-600 mb-2" />
                                    <p className="text-xs text-purple-700 font-medium">Số người</p>
                                    <p className="text-lg font-bold text-purple-900">{booking.numberOfPeople} người</p>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-4 border border-emerald-200">
                                    <Wallet className="w-8 h-8 text-emerald-600 mb-2" />
                                    <p className="text-xs text-emerald-700 font-medium">Tổng tiền</p>
                                    <p className="text-lg font-bold text-emerald-900">{formatCurrency(booking.totalPrice)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact - Ngang */}
                        <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-white/50 p-6">
                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-5 border border-indigo-200">
                                <h3 className="text-base font-bold text-indigo-900 mb-4 flex items-center gap-2">
                                    <UserCheck className="w-5 h-5" />
                                    Thông tin liên lạc
                                </h3>
                                <div className="flex items-center justify-between flex-wrap gap-4 text-indigo-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                                            {(booking.contactName || booking.userFullname || '?')[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{booking.contactName || booking.userFullname}</p>
                                            {booking.guest && <p className="text-xs text-orange-600">Khách vãng lai</p>}
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="flex items-center gap-2">
                                            <PhoneCall className="w-4 h-4 text-indigo-600" />
                                            <span className="text-sm">{booking.contactPhone || booking.userPhone}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-indigo-600" />
                                            <span className="text-sm">{booking.contactEmail}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transport */}
                        {booking.selectedTransportName && (
                            <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-white/50 p-6">
                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {booking.selectedTransportName.includes('Máy bay') ? <Plane className="w-8 h-8 text-amber-600" /> :
                                                booking.selectedTransportName.includes('Xe') ? <Car className="w-8 h-8 text-amber-600" /> :
                                                    <Hotel className="w-8 h-8 text-amber-600" />}
                                            <div>
                                                <p className="font-bold text-amber-900 text-base">{booking.selectedTransportName}</p>
                                                <p className="text-sm text-amber-700">Phụ thu di chuyển</p>
                                            </div>
                                        </div>
                                        <p className="text-xl font-bold text-amber-800">
                                            +{formatCurrency(booking.selectedTransportPrice || 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Note */}
                        {booking.note && (
                            <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-white/50 p-6">
                                <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-5 border border-rose-200">
                                    <div className="flex gap-4">
                                        <Coffee className="w-6 h-6 text-rose-600 flex-shrink-0" />
                                        <div>
                                            <p className="font-bold text-rose-900 mb-1">Ghi chú đặc biệt từ bạn</p>
                                            <p className="text-rose-800 italic">{booking.note}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cột phải - Thông tin phụ */}
                    <div className="space-y-6">
                        {/* Payment Status */}
                        <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-white/50 p-6">
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200 text-center">
                                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                                <p className="text-base font-bold text-green-800">
                                    {booking.paymentStatus === 'PAID'
                                        ? 'Đã thanh toán'
                                        : 'Chưa thanh toán'}
                                </p>
                                {booking.paymentStatus === 'PAID' && booking.paidAt && (
                                    <p className="text-xs text-green-700 mt-1">{formatDate(booking.paidAt)}</p>
                                )}
                                {booking.paymentStatus !== 'PAID' && (
                                    <p className="text-xs text-green-700 mt-1">Vui lòng hoàn tất trước ngày khởi hành</p>
                                )}
                            </div>
                        </div>

                        {/* Weather Tip */}
                        <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-white/50 p-6">
                            <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl p-5 border border-sky-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <Sun className="w-10 h-10 text-yellow-500" />
                                    <CloudRain className="w-8 h-8 text-sky-400" />
                                </div>
                                <p className="font-bold text-sky-900 mb-2">Thời tiết dự báo</p>
                                <p className="text-sm text-sky-700">Nắng đẹp, nhiệt độ 24-30°C</p>
                                <p className="text-xs text-sky-600 mt-1">Nhớ mang kem chống nắng nhé!</p>
                            </div>
                        </div>

                        {/* Final Message */}
                        <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-white/50 p-6">
                            <div className="text-center">
                                <p className="text-lg font-bold text-gray-800 mb-2">
                                    {booking.status === 'CONFIRMED' ? 'Hành trình tuyệt vời đang chờ bạn!' :
                                        booking.status === 'COMPLETED' ? 'Cảm ơn bạn đã đồng hành!' :
                                            'Đang xử lý booking...'}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Có thắc mắc? Gọi ngay
                                </p>
                                <p className="font-bold text-teal-600 text-lg mt-1">1900 1234</p>
                                <p className="text-xs text-gray-500 mt-2">Chúng tôi luôn sẵn sàng hỗ trợ!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyBookingDetailPage;