import React, { useState, useEffect } from 'react';
import { Calendar, Users, Heart, Eye, Car, User, CreditCard, Wallet } from 'lucide-react';
import { createBooking } from '../../../../../services/bookingService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import axios from 'axios'; // Đã có trong bookingService, nhưng để chắc thì import

interface TransportOption {
    name: string;
    price: number;
    icon: React.ReactNode;
}

interface TourBookingCardProps {
    price: number;
    maxParticipants: number;
    totalParticipants: number;
    startDates: string[];
    transports: TransportOption[];
    date: string;
    setDate: (date: string) => void;
    people: number;
    setPeople: (num: number) => void;
    notes: string;
    setNotes: (note: string) => void;
    onBooking: () => void;
    savedToWishlist: boolean;
    setSavedToWishlist: (value: boolean) => void;
    tourId: number;
    tourName: string;
    views: number;
}

const TourBookingCard: React.FC<TourBookingCardProps> = ({
    price, maxParticipants, totalParticipants, startDates, transports = [],
    date, setDate, people, setPeople, notes, setNotes, onBooking,
    savedToWishlist, setSavedToWishlist, tourId, tourName, views,
}) => {
    const token = typeof window !== 'undefined'
        ? localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken')
        : null;

    const [selectedTransport, setSelectedTransport] = useState<TransportOption | null>(null);
    const [showGuestForm, setShowGuestForm] = useState(false);
    const [guestInfo, setGuestInfo] = useState({ contactName: '', contactEmail: '', contactPhone: '' });
    const [paymentMethod, setPaymentMethod] = useState<'DIRECT' | 'MOMO'>('DIRECT');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (transports.length > 0 && !selectedTransport) {
            const cheapest = transports.reduce((a, b) => (a.price < b.price ? a : b));
            setSelectedTransport(cheapest);
        }
    }, [transports, selectedTransport]);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const remainingSeats = maxParticipants - totalParticipants;
    const maxPeopleSelect = Math.min(10, remainingSeats);

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const availableDates = startDates.map(d => new Date(d)).filter(d => d >= today).sort((a, b) => a.getTime() - b.getTime());
    const hasAvailableDates = availableDates.length > 0;

    const basePrice = price * people;
    const transportPrice = selectedTransport ? selectedTransport.price * people : 0;
    const totalPrice = basePrice + transportPrice;

    const handleBooking = async () => {
        if (!date) return toast.error('Vui lòng chọn ngày khởi hành');
        if (people > remainingSeats) return toast.error(`Chỉ còn ${remainingSeats} chỗ trống`);

        if (!token) {
            if (!guestInfo.contactName || !guestInfo.contactEmail || !guestInfo.contactPhone) {
                setShowGuestForm(true);
                toast.info('Vui lòng nhập thông tin liên hệ');
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(guestInfo.contactEmail)) return toast.error('Email không hợp lệ');
        }

        const result = await Swal.fire({
            title: 'Xác nhận đặt tour',
            html: `
                <div class="text-left space-y-3 text-sm">
                    <p><strong>Tour:</strong> ${tourName}</p>
                    <p><strong>Ngày:</strong> ${new Date(date).toLocaleDateString('vi-VN')}</p>
                    <p><strong>Số người:</strong> ${people}</p>
                    ${selectedTransport ? `<p><strong>Phương tiện:</strong> ${selectedTransport.name} (+${formatCurrency(selectedTransport.price * people)})</p>` : ''}
                    <p><strong>Thanh toán:</strong> ${paymentMethod === 'DIRECT' ? 'Trực tiếp (tại quầy)' : 'MoMo (online)'}</p>
                    <hr class="my-3">
                    <p>Giá tour: ${formatCurrency(basePrice)}</p>
                    ${transportPrice > 0 ? `<p>Phương tiện: ${formatCurrency(transportPrice)}</p>` : ''}
                    <p class="text-xl font-bold text-green-600">Tổng: ${formatCurrency(totalPrice)}</p>
                    ${!token ? `
                    <div class="bg-blue-50 p-4 rounded-lg mt-4 text-sm">
                        <p class="font-semibold text-blue-900 mb-2">Thông tin liên hệ:</p>
                        <p><strong>${guestInfo.contactName}</strong></p>
                        <p>${guestInfo.contactEmail}</p>
                        <p>${guestInfo.contactPhone}</p>
                    </div>` : ''}
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: paymentMethod === 'MOMO' ? 'Thanh toán qua MoMo' : 'Đặt tour ngay',
            cancelButtonText: 'Hủy',
            confirmButtonColor: paymentMethod === 'MOMO' ? '#e21d59' : '#0891b2',
        });

        if (!result.isConfirmed) return;

        setSubmitting(true);

        try {
            // Bước 1: Tạo booking trước
            const bookingResponse = await createBooking({
                tourId,
                startDate: date,
                numberOfPeople: people,
                transportName: selectedTransport?.name || undefined,
                paymentMethod,
                note: notes || undefined,
                ...(!token && {
                    contactName: guestInfo.contactName,
                    contactEmail: guestInfo.contactEmail,
                    contactPhone: guestInfo.contactPhone,
                }),
            });

            const bookingId = bookingResponse.id;

            // Nếu chọn MoMo → gọi API tạo link thanh toán
            if (paymentMethod === 'MOMO') {
                toast.info('Đang chuyển sang cổng thanh toán MoMo...');

                const res = await axios.post('http://localhost:8080/api/payments/momo/create/' + bookingId);
                const payUrl: string = res.data.data; // backend trả về URL

                // Chuyển hướng sang MoMo
                window.location.href = payUrl;
                return; // Dừng lại, không chạy tiếp
            }

            // Nếu là DIRECT → chỉ thông báo thành công
            toast.success('Đặt tour thành công! Chúng tôi sẽ liên hệ sớm nhất.');
            onBooking();

            if (!token) {
                toast.info(`Bạn hãy đăng ký bằng email "${guestInfo.contactEmail}" để theo dõi booking nhé!`, { autoClose: 8000 });
                setGuestInfo({ contactName: '', contactEmail: '', contactPhone: '' });
                setShowGuestForm(false);
            }

        } catch (err: any) {
            const msg = err.response?.data?.message || 'Đặt tour thất bại. Vui lòng thử lại!';
            toast.error(msg);
        } finally {
            if (paymentMethod !== 'MOMO') {
                setSubmitting(false);
            }
        }
    };

    return (
        <div className="sticky top-4 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border">
                <div className="mb-6 p-5 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 text-center">
                    <p className="text-sm text-gray-600">Tổng tiền</p>
                    <p className="text-4xl font-bold text-cyan-600">{formatCurrency(totalPrice)}</p>
                    <p className="text-xs text-gray-500 mt-1">{people} người × {formatCurrency(price + (selectedTransport?.price || 0))}/người</p>
                </div>

                <div className="space-y-5">
                    {/* Ngày khởi hành */}
                    <div>
                        <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            Ngày khởi hành
                        </label>
                        {hasAvailableDates ? (
                            <select value={date} onChange={e => setDate(e.target.value)}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600">
                                <option value="">-- Chọn ngày --</option>
                                {availableDates.map(d => {
                                    const str = d.toISOString().split('T')[0];
                                    const fmt = d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
                                    return <option key={str} value={str}>{fmt}</option>;
                                })}
                            </select>
                        ) : (
                            <div className="w-full py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
                                Chưa có lịch khởi hành
                            </div>
                        )}
                    </div>

                    {/* Phương tiện */}
                    {transports.length > 0 && (
                        <div>
                            <label className="flex items-center gap-2 text-gray-700 mb-3 font-medium">
                                <Car className="w-5 h-5 text-blue-600" />
                                Phương tiện di chuyển
                            </label>
                            <div className="space-y-3">
                                {transports.map(t => (
                                    <label key={t.name}
                                        className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition
                                            ${selectedTransport?.name === t.name ? 'border-cyan-600 bg-cyan-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className="flex items-center gap-3">
                                            <input type="radio" name="transport" checked={selectedTransport?.name === t.name}
                                                onChange={() => setSelectedTransport(t)} className="w-5 h-5 text-cyan-600" />
                                            <div className="flex items-center gap-2">
                                                {t.icon}
                                                <span className="font-medium">{t.name}</span>
                                            </div>
                                        </div>
                                        <span className={`font-semibold ${t.price === 0 ? 'text-green-600' : ''}`}>
                                            {t.price === 0 ? 'Miễn phí' : `+${formatCurrency(t.price)}`}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Số người */}
                    <div>
                        <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                            <Users className="w-5 h-5 text-blue-600" />
                            Số người
                        </label>
                        <select value={people} onChange={e => setPeople(Number(e.target.value))}
                            disabled={!date || remainingSeats === 0}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600">
                            {[...Array(maxPeopleSelect)].map((_, i) => (
                                <option key={i + 1} value={i + 1} disabled={i + 1 > remainingSeats}>
                                    {i + 1} người {i + 1 > remainingSeats && '(Hết chỗ)'}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* PHƯƠNG THỨC THANH TOÁN – ĐẸP HƠN */}
                    <div>
                        <label className="flex items-center gap-2 text-gray-700 mb-3 font-medium">
                            <Wallet className="w-5 h-5 text-blue-600" />
                            Phương thức thanh toán
                        </label>
                        <div className="space-y-3">
                            <label className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition
                                ${paymentMethod === 'DIRECT' ? 'border-cyan-600 bg-cyan-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="payment" checked={paymentMethod === 'DIRECT'}
                                        onChange={() => setPaymentMethod('DIRECT')} className="w-5 h-5 text-cyan-600" />
                                    <div>
                                        <p className="font-medium">Thanh toán trực tiếp</p>
                                        <p className="text-xs text-gray-500">Tại quầy / Chuyển khoản</p>
                                    </div>
                                </div>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Phổ biến</span>
                            </label>

                            <label className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition
                                ${paymentMethod === 'MOMO' ? 'border-pink-600 bg-pink-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="payment" checked={paymentMethod === 'MOMO'}
                                        onChange={() => setPaymentMethod('MOMO')} className="w-5 h-5 text-pink-600" />
                                    <div>
                                        <p className="font-medium text-pink-700">Thanh toán MoMo</p>
                                        <p className="text-xs text-gray-500">Ví điện tử, thẻ ngân hàng</p>
                                    </div>
                                </div>
                                <span className="bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                    <CreditCard size={14} /> Nhanh nhất
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Form khách vãng lai */}
                    {!token && showGuestForm && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-4">
                            <p className="font-semibold text-blue-900 flex items-center gap-2">
                                <User className="w-5 h-5" /> Thông tin liên hệ
                            </p>
                            <input type="text" placeholder="Họ và tên" value={guestInfo.contactName}
                                onChange={e => setGuestInfo({ ...guestInfo, contactName: e.target.value })}
                                className="w-full px-4 py-3 border rounded-lg" />
                            <input type="email" placeholder="Email" value={guestInfo.contactEmail}
                                onChange={e => setGuestInfo({ ...guestInfo, contactEmail: e.target.value })}
                                className="w-full px-4 py-3 border rounded-lg" />
                            <input type="tel" placeholder="Số điện thoại" value={guestInfo.contactPhone}
                                onChange={e => setGuestInfo({ ...guestInfo, contactPhone: e.target.value })}
                                className="w-full px-4 py-3 border rounded-lg" />
                        </div>
                    )}

                    <textarea placeholder="Ghi chú (trẻ em, ăn chay, dị ứng...)" rows={3}
                        value={notes} onChange={e => setNotes(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 resize-none" />

                    <button onClick={handleBooking}
                        disabled={submitting || !date || remainingSeats === 0 || people < 1}
                        className={`w-full text-white py-5 rounded-lg font-bold text-lg transition transform hover:scale-105 ${paymentMethod === 'MOMO'
                            ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700'
                            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                            } disabled:opacity-60 disabled:cursor-not-allowed`}>
                        {submitting ? 'Đang xử lý...' : paymentMethod === 'MOMO' ? 'THANH TOÁN QUA MOMO' : 'ĐẶT TOUR NGAY'}
                    </button>

                    {!token && !showGuestForm && (
                        <p className="text-center text-sm text-gray-600 -mt-3">
                            <span className="text-red-600 font-semibold">Chưa đăng nhập?</span> Vẫn đặt được tour bình thường!
                        </p>

                    )}

                    <div className="flex justify-between items-center pt-4 border-t">
                        <button onClick={() => setSavedToWishlist(!savedToWishlist)}
                            className="flex items-center gap-2 text-gray-700 hover:text-red-600">
                            <Heart className={`w-5 h-5 ${savedToWishlist ? 'fill-red-600 text-red-600' : ''}`} />
                            <span>Yêu thích</span>
                        </button>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Eye className="w-5 h-5" />
                            <span>{views.toLocaleString('vi-VN')} lượt xem</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourBookingCard;