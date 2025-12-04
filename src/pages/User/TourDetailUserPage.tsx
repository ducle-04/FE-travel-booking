// src/pages/User/TourDetailUserPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Users, Phone, Mail, Heart, Eye, Check, X, ChevronDown, ChevronUp, Star,
    Play, ChevronLeft, ChevronRight, Car, MapPin, Clock, Hotel as HotelIcon,
    Waves, Trees, Landmark, Utensils, Tag
} from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import ItineraryAccordion from "../../components/Layout/DefautLayout/UserLayout/Tour/ItineraryAccordion";
import UserHotelModal from "../../components/Layout/DefautLayout/UserLayout/Tour/UserHotelModal";
import { fetchTourDetail } from '../../services/tourDetailService';
import { createBooking } from '../../services/bookingService';

// Types
interface TransportDTO {
    name: string;
    price: number;
}

interface HotelDTO {
    id: number;
    name: string;
    address: string;
    starRating: string;
    description?: string;
    images: string[];
    videos?: string[];
}

interface TourDetail {
    itinerary: string;
    departurePoint: string;
    departureTime: string;
    suitableFor: string;
    cancellationPolicy: string;
    transports: TransportDTO[];
    selectedHotels: HotelDTO[];
    additionalImages: string[];
    videos: string[];
}

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
    categoryName?: string;
    categoryIcon?: string;
    tourDetail?: TourDetail | null;
}

const MOCK_REVIEWS = [
    { id: 1, userName: "Nguyễn Văn A", rating: 5, comment: "Tour rất tuyệt vời! Hướng dẫn viên nhiệt tình, cảnh đẹp, ăn uống đầy đủ.", createdAt: "15/10/2025" },
    { id: 2, userName: "Trần Thị B", rating: 4, comment: "Chuyến đi ổn, nhưng xe hơi chật một chút. Bù lại ăn uống ngon và lịch trình hợp lý.", createdAt: "10/10/2025" },
    { id: 3, userName: "Lê Văn C", rating: 5, comment: "Đúng như quảng cáo! Đi đúng giờ, hướng dẫn viên vui tính, ảnh đẹp. Rất hài lòng!", createdAt: "28/09/2025" }
];

const TourDetailUserPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [tour, setTour] = useState<Tour | null>(null);
    const [detail, setDetail] = useState<TourDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [savedToWishlist, setSavedToWishlist] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState<number>(-1);
    const [selectedHotel, setSelectedHotel] = useState<HotelDTO | null>(null); // THÊM DÒNG NÀY

    const [activeTab, setActiveTab] = useState<'booking' | 'enquiry'>('booking');
    const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    const [people, setPeople] = useState<number>(1);
    const [notes, setNotes] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);

    const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');

    const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    const formatDate = (dateStr: string) => format(new Date(dateStr), 'dd/MM/yyyy');

    const faqs = [
        { question: "Tôi có thể được hoàn tiền không?", answer: "Chúng tôi sẽ hỗ trợ bạn! Vui lòng liên hệ bộ phận chăm sóc khách hàng để được tư vấn về chính sách hoàn tiền." },
        { question: "Tôi có thể thay đổi ngày đi không?", answer: "Có, bạn có thể thay đổi ngày đi trước 7 ngày so với ngày khởi hành. Vui lòng liên hệ để được hỗ trợ." },
        { question: "Mã giảm giá của tôi không hoạt động, tôi phải làm gì?", answer: "Vui lòng đảm bảo mã giảm giá còn hiệu lực. Liên hệ đội ngũ hỗ trợ nếu vẫn gặp vấn đề." },
        { question: "Tôi có cần xin visa không?", answer: "Yêu cầu visa phụ thuộc vào quốc tịch và điểm đến. Chúng tôi khuyến nghị kiểm tra với đại sứ quán." }
    ];

    const getCategoryIcon = (iconName?: string) => {
        switch (iconName) {
            case 'Waves': return <Waves size={18} />;
            case 'Trees': return <Trees size={18} />;
            case 'Landmark': return <Landmark size={18} />;
            case 'Utensils': return <Utensils size={18} />;
            default: return <Tag size={18} />;
        }
    };

    const getCategoryGradient = (name?: string) => {
        if (!name) return 'from-indigo-500 to-purple-600';
        if (name.includes('Biển') || name.includes('Sea')) return 'from-cyan-500 to-blue-600';
        if (name.includes('Núi') || name.includes('Mountain')) return 'from-green-500 to-emerald-600';
        if (name.includes('Văn hóa') || name.includes('Culture')) return 'from-purple-500 to-pink-600';
        if (name.includes('Ẩm thực') || name.includes('Food')) return 'from-orange-500 to-red-600';
        return 'from-indigo-500 to-purple-600';
    };

    useEffect(() => {
        if (id) fetchTourDetailData();
    }, [id]);

    const fetchTourDetailData = async () => {
        setLoading(true);
        try {
            const data = await fetchTourDetail(id!);
            setTour(data);
            setDetail(data.tourDetail || null);
        } catch (error: any) {
            toast.error(error.message || 'Không thể tải chi tiết tour');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!token) {
            toast.error('Vui lòng đăng nhập để đặt tour');
            navigate('/login');
            return;
        }

        const remaining = tour!.maxParticipants - tour!.totalParticipants;
        if (people > remaining) {
            toast.error(`Chỉ còn ${remaining} chỗ trống`);
            return;
        }

        const result = await Swal.fire({
            title: 'Xác nhận đặt tour',
            html: `
                <div class="text-left space-y-2">
                    <p><strong>Tour:</strong> ${tour?.name}</p>
                    <p><strong>Giá:</strong> ${formatCurrency(tour!.price * people)}</p>
                    <p><strong>Số người:</strong> ${people}</p>
                    <p><strong>Ngày khởi hành:</strong> ${formatDate(date)}</p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đặt tour ngay',
            cancelButtonText: 'Hủy',
        });

        if (!result.isConfirmed) return;

        setSubmitting(true);
        try {
            await createBooking({
                tourId: Number(id),
                numberOfPeople: people,
                startDate: date,
                note: notes.trim() || undefined
            });

            toast.success('Đặt tour thành công! Chúng tôi sẽ liên hệ sớm nhất.');
            setPeople(1);
            setNotes('');
            fetchTourDetailData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Đặt tour thất bại');
            if (error.response?.data?.message?.includes('chỗ trống')) {
                fetchTourDetailData();
            }
        } finally {
            setSubmitting(false);
        }
    };

    const openVideo = (url: string) => {
        setSelectedVideo(url);
        setShowVideoModal(true);
    };

    const openGallery = () => setShowGalleryModal(true);

    const nextImage = () => {
        const all = [tour!.imageUrl, ...(detail?.additionalImages || [])];
        setCurrentImageIndex((prev) => (prev + 1) % all.length);
    };

    const prevImage = () => {
        const all = [tour!.imageUrl, ...(detail?.additionalImages || [])];
        setCurrentImageIndex((prev) => (prev - 1 + all.length) % all.length);
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-cyan-600"></div>
        </div>
    );

    if (!tour) return (
        <div className="text-center p-10 text-red-500 text-xl">Tour không tồn tại</div>
    );

    const allImages = [tour.imageUrl, ...(detail?.additionalImages || [])];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative h-[600px] bg-gray-100 overflow-hidden flex items-center">
                <img
                    src={allImages[currentImageIndex]}
                    alt={tour.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/1600x500?text=Tour+Image'}
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

                <div className="relative z-10 text-white px-8 md:px-16 lg:px-24 max-w-3xl">
                    <div className="mb-6">
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${tour.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-500'}`}>
                            {tour.status === 'ACTIVE' ? 'Đang mở đặt' : 'Tạm dừng'}
                        </span>
                    </div>

                    {tour.categoryName && (
                        <div className="mb-6">
                            <span className={`inline-block px-5 py-2.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 bg-gradient-to-r ${getCategoryGradient(tour.categoryName)} text-white`}>
                                {getCategoryIcon(tour.categoryIcon)}
                                {tour.categoryName}
                            </span>
                        </div>
                    )}

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 drop-shadow-lg">{tour.name}</h1>

                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="px-4 py-2 bg-blue-600 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                            <MapPin size={16} /> {tour.destinationName}
                        </span>
                        <span className="px-4 py-2 bg-orange-500 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                            <Clock size={16} /> {tour.duration}
                        </span>
                        <span className="px-4 py-2 bg-green-600 rounded-full text-sm font-medium shadow-lg">
                            Từ {formatCurrency(tour.price)}
                        </span>
                    </div>

                    <div className="flex items-center gap-6 mb-6">
                        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={18} className={i < Math.round(tour.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-400 text-gray-400'} />
                            ))}
                            <span className="ml-1 text-sm font-medium">({tour.reviewsCount} đánh giá)</span>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-6 left-6 flex gap-3 z-10">
                    <button onClick={openGallery} className="px-5 py-3 bg-white/90 backdrop-blur text-gray-900 rounded-lg flex items-center gap-2 font-medium hover:bg-white transition shadow-lg">
                        Album ảnh
                    </button>
                    {detail?.videos && detail.videos.length > 0 && (
                        <button onClick={() => openVideo(detail.videos[0])} className="px-5 py-3 bg-white/90 backdrop-blur text-gray-900 rounded-lg flex items-center gap-2 font-medium hover:bg-white transition shadow-lg">
                            <Play size={18} /> Xem video
                        </button>
                    )}
                </div>

                {allImages.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur text-gray-900 rounded-full hover:bg-white transition shadow-lg z-10">
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur text-gray-900 rounded-full hover:bg-white transition shadow-lg z-10">
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Tour Info */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-8 shadow-sm">
                            <h1 className="text-3xl font-bold mb-4">{tour.name}</h1>
                            <p className="text-gray-700 leading-relaxed text-base mb-8">{tour.description || 'Trải nghiệm hành trình tuyệt vời cùng chúng tôi...'}</p>

                            {/* Quick Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 py-6 border-y border-gray-200 mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <Car className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Phương tiện</p>
                                        <p className="font-semibold">
                                            {detail?.transports?.length ? detail.transports.map(t => t.name).join(', ') : 'Xe du lịch cao cấp'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <MapPin className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Điểm đón</p>
                                        <p className="font-semibold">{detail?.departurePoint || 'Trung tâm thành phố'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Giờ khởi hành</p>
                                        <p className="font-semibold">{detail?.departureTime || '07:00 AM'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <Users className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Phù hợp với</p>
                                        <p className="font-semibold">{detail?.suitableFor || 'Mọi lứa tuổi'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Hotels – GIỮ NGUYÊN STYLE CŨ + THÊM NÚT XEM CHI TIẾT */}
                            {detail?.selectedHotels && detail.selectedHotels.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold mb-5 flex items-center gap-2">
                                        <HotelIcon className="w-6 h-6 text-blue-600" />
                                        Khách sạn trong tour
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {detail.selectedHotels.map(hotel => (
                                            <div key={hotel.id} className="relative bg-gray-50 rounded-xl overflow-hidden shadow-sm">
                                                <div className="flex items-center gap-4 p-4">
                                                    {hotel.images[0] && (
                                                        <img
                                                            src={hotel.images[0]}
                                                            alt={hotel.name}
                                                            className="w-20 h-20 object-cover rounded-lg shadow-md flex-shrink-0"
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-lg">{hotel.name}</h4>
                                                        <p className="text-sm text-gray-600">{hotel.address}</p>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={14}
                                                                    className={i < parseInt(hotel.starRating) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}
                                                                />

                                                            ))}
                                                            <span className="text-xs ml-1">{hotel.starRating} sao</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* NÚT XEM CHI TIẾT */}
                                                <div className="px-4 pb-4">
                                                    <button
                                                        onClick={() => setSelectedHotel(hotel)}
                                                        className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition shadow"
                                                    >
                                                        Xem chi tiết khách sạn
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
                                    <Check className="w-6 h-6 text-green-600" />
                                    Giá tour đã bao gồm
                                </h2>
                                <div className="space-y-3">
                                    {['Vé tham quan tất cả các điểm', 'Hướng dẫn viên suốt hành trình', 'Bữa ăn theo chương trình', 'Nước uống & khăn lạnh hàng ngày', 'Bảo hiểm du lịch đầy đủ'].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Itinerary */}
                        {detail?.itinerary && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-6">Lịch trình chi tiết</h2>
                                <ItineraryAccordion itineraryHtml={detail.itinerary} />
                            </motion.div>
                        )}

                        {/* FAQ */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl p-8 shadow-sm">
                            <h2 className="text-2xl font-bold mb-6">Câu hỏi thường gặp</h2>
                            <div className="space-y-4">
                                {faqs.map((faq, i) => (
                                    <div key={i} className="border-b border-gray-200 last:border-0 pb-4">
                                        <button onClick={() => setExpandedFaq(expandedFaq === i ? -1 : i)} className="w-full flex justify-between items-center text-left py-2">
                                            <span className="font-semibold">{faq.question}</span>
                                            {expandedFaq === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </button>
                                        {expandedFaq === i && <p className="text-gray-600 mt-2 pl-1">{faq.answer}</p>}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Reviews */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-xl p-8 shadow-sm">
                            <h2 className="text-2xl font-bold mb-6">Đánh giá từ khách hàng</h2>
                            <div className="space-y-6">
                                {MOCK_REVIEWS.map(r => (
                                    <div key={r.id} className="flex gap-4 p-5 rounded-xl bg-gray-50 border">
                                        <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                            {r.userName[0]}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="font-semibold text-lg">{r.userName}</p>
                                                <p className="text-sm text-gray-500">{r.createdAt}</p>
                                            </div>
                                            <div className="flex gap-1 mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={16} className={i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                                                ))}
                                            </div>
                                            <p className="text-gray-700 leading-relaxed">{r.comment}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Booking Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 space-y-6">
                            <div className="bg-white rounded-xl p-6 shadow-lg border">
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="text-gray-600">Từ</span>
                                    <span className="text-3xl font-bold text-cyan-600">{formatCurrency(tour.price)}</span>
                                    <span className="text-gray-500">/ người</span>
                                </div>

                                <div className="border-b border-gray-200 mb-6">
                                    <div className="flex gap-6 mb-4">
                                        <button onClick={() => setActiveTab('booking')} className={`pb-3 font-medium border-b-2 ${activeTab === 'booking' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>
                                            Đặt tour
                                        </button>
                                        <button onClick={() => setActiveTab('enquiry')} className={`pb-3 font-medium border-b-2 ${activeTab === 'enquiry' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>
                                            Tư vấn
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="flex items-center gap-2 text-gray-700 mb-2">
                                            <Calendar className="w-5 h-5 text-blue-600" /> Ngày khởi hành
                                        </label>
                                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                                        <p className="text-sm text-gray-500 mt-1">Còn lại: <strong>{tour.maxParticipants - tour.totalParticipants}</strong> chỗ</p>
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 text-gray-700 mb-2">
                                            <Users className="w-5 h-5 text-blue-600" /> Số người
                                        </label>
                                        <select value={people} onChange={e => setPeople(Number(e.target.value))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600">
                                            {[...Array(Math.min(10, tour.maxParticipants - tour.totalParticipants))].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>{i + 1} người</option>
                                            ))}
                                        </select>
                                    </div>

                                    <textarea
                                        placeholder="Ghi chú thêm (yêu cầu đặc biệt, trẻ em, người già...)"
                                        rows={3}
                                        value={notes}
                                        onChange={e => setNotes(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 resize-none"
                                    />

                                    <button
                                        onClick={handleBooking}
                                        disabled={submitting}
                                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-60"
                                    >
                                        {submitting ? 'Đang xử lý...' : 'ĐẶT TOUR NGAY'}
                                    </button>

                                    <div className="flex justify-between items-center pt-4 border-t">
                                        <button onClick={() => setSavedToWishlist(!savedToWishlist)} className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition">
                                            <Heart className={`w-5 h-5 ${savedToWishlist ? 'fill-red-600 text-red-600' : ''}`} />
                                            Yêu thích
                                        </button>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Eye className="w-5 h-5" />
                                            <span>6.249 lượt xem</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Support Boxes */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="text-xl font-bold mb-4">Đặt tour an tâm</h3>
                                <div className="space-y-4 text-sm">
                                    <div className="flex items-center gap-3"><Check className="w-6 h-6 text-green-600" /><span>Giá tốt nhất</span></div>
                                    <div className="flex items-center gap-3"><Phone className="w-6 h-6 text-blue-600" /><span>Hỗ trợ 24/7</span></div>
                                    <div className="flex items-center gap-3"><Star className="w-6 h-6 text-yellow-500" /><span>Tour chất lượng cao</span></div>
                                    <div className="flex items-center gap-3"><HotelIcon className="w-6 h-6 text-purple-600" /><span>Bảo hiểm du lịch</span></div>
                                </div>
                            </div>

                            <div className="bg-gray-900 text-white rounded-xl p-6">
                                <h3 className="text-xl font-bold mb-2">Cần hỗ trợ?</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3"><Phone className="w-5 h-5" /><span>1900 1234</span></div>
                                    <div className="flex items-center gap-3"><Mail className="w-5 h-5" /><span>support@travel.vn</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Modal */}
            <AnimatePresence>
                {showGalleryModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowGalleryModal(false)}>
                        <div className="relative max-w-7xl w-full" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setShowGalleryModal(false)} className="absolute -top-12 right-0 text-white text-4xl"><X size={36} /></button>
                            <img src={allImages[currentImageIndex]} alt="" className="w-full max-h-screen object-contain rounded-xl" />
                            {allImages.length > 1 && (
                                <>
                                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/20 backdrop-blur text-white rounded-full hover:bg-white/40"><ChevronLeft size={32} /></button>
                                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/20 backdrop-blur text-white rounded-full hover:bg-white/40"><ChevronRight size={32} /></button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Video Modal */}
            <AnimatePresence>
                {showVideoModal && selectedVideo && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8"
                        onClick={() => setShowVideoModal(false)}>
                        <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setShowVideoModal(false)} className="absolute -top-12 right-0 text-white text-4xl"><X size={36} /></button>
                            <video src={selectedVideo} controls autoPlay className="w-full rounded-xl shadow-2xl" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal chi tiết khách sạn – ĐẸP, NHẸ, HỢP STYLE CŨ */}
            <UserHotelModal
                isOpen={!!selectedHotel}
                onClose={() => setSelectedHotel(null)}
                hotel={selectedHotel}
            />

        </div>
    );
};

export default TourDetailUserPage;