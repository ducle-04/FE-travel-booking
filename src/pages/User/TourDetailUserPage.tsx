import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Users, Phone, Mail, Heart, Eye, Check, X, ChevronDown, ChevronUp, Star,
    Play, ChevronLeft, ChevronRight, Car, MapPin, Clock
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import ItineraryAccordion from "../../components/Layout/DefautLayout/UserLayout/Tour/ItineraryAccordion";

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
    tourDetail?: TourDetail;
}

interface TourDetail {
    transportation: string;
    itinerary: string;
    departurePoint: string;
    departureTime: string;
    suitableFor: string;
    cancellationPolicy: string;
    additionalImages: string[];
    videos: string[];
}

interface Review {
    id: number;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface FAQ {
    question: string;
    answer: string;
}

const MOCK_REVIEWS: Review[] = [
    {
        id: 1,
        userName: "Nguyễn Văn A",
        rating: 5,
        comment: "Tour rất tuyệt vời! Hướng dẫn viên nhiệt tình, cảnh đẹp, ăn uống đầy đủ. Sẽ đi lại lần nữa!",
        createdAt: "2025-10-15T10:30:00Z"
    },
    {
        id: 2,
        userName: "Trần Thị B",
        rating: 4,
        comment: "Chuyến đi ổn, nhưng xe hơi chật một chút. Bù lại ăn uống ngon và lịch trình hợp lý.",
        createdAt: "2025-10-10T14:20:00Z"
    },
    {
        id: 3,
        userName: "Lê Văn C",
        rating: 5,
        comment: "Đúng như quảng cáo! Đi đúng giờ, hướng dẫn viên vui tính, ảnh đẹp. Rất hài lòng!",
        createdAt: "2025-09-28T09:15:00Z"
    }
];

const TourDetailUserPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [tour, setTour] = useState<Tour | null>(null);
    const [detail, setDetail] = useState<TourDetail | null>(null);
    const [reviews] = useState<Review[]>(MOCK_REVIEWS);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [savedToWishlist, setSavedToWishlist] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState<number>(-1);

    const [activeTab, setActiveTab] = useState<'booking' | 'enquiry'>('booking');
    const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    const [people, setPeople] = useState<number>(1);
    const [bookingForm, setBookingForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        notes: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');

    const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    const formatDate = (dateStr: string) => format(new Date(dateStr), 'dd/MM/yyyy');

    const faqs: FAQ[] = [
        { question: "Tôi có thể được hoàn tiền không?", answer: "Chúng tôi sẽ hỗ trợ bạn! Vui lòng liên hệ bộ phận chăm sóc khách hàng để được tư vấn về chính sách hoàn tiền." },
        { question: "Tôi có thể thay đổi ngày đi không?", answer: "Có, bạn có thể thay đổi ngày đi trước 7 ngày so với ngày khởi hành. Vui lòng liên hệ để được hỗ trợ." },
        { question: "Mã giảm giá của tôi không hoạt động, tôi phải làm gì?", answer: "Vui lòng đảm bảo mã giảm giá còn hiệu lực. Liên hệ đội ngũ hỗ trợ nếu vẫn gặp vấn đề." },
        { question: "Tôi có cần xin visa không?", answer: "Yêu cầu visa phụ thuộc vào quốc tịch và điểm đến. Chúng tôi khuyến nghị kiểm tra với đại sứ quán." }
    ];

    useEffect(() => {
        if (id) fetchTourDetail();
    }, [id]);

    const fetchTourDetail = async () => {
        setLoading(true);
        try {
            const tourRes = await axios.get(`http://localhost:8080/api/tours/${id}`);
            const tourData = tourRes.data.tour;
            setTour(tourData);
            setDetail(tourData.tourDetail || {
                transportation: '', itinerary: '', departurePoint: '', departureTime: '',
                suitableFor: '', cancellationPolicy: '', additionalImages: [], videos: []
            });
        } catch (error: any) {
            toast.error('Không thể tải chi tiết tour');
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

        if (!bookingForm.fullName || !bookingForm.email || !bookingForm.phone || people < 1) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }

        const result = await Swal.fire({
            title: 'Xác nhận đặt tour',
            html: `
                <div class="text-left">
                    <p><strong>Tour:</strong> ${tour?.name}</p>
                    <p><strong>Giá:</strong> ${formatCurrency(tour!.price * people)}</p>
                    <p><strong>Số người:</strong> ${people}</p>
                    <p><strong>Ngày:</strong> ${formatDate(date)}</p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đặt tour',
            cancelButtonText: 'Hủy',
        });

        if (!result.isConfirmed) return;

        setSubmitting(true);
        try {
            await axios.post(`http://localhost:8080/api/bookings`, {
                tourId: id,
                participants: people,
                ...bookingForm
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Đặt tour thành công! Chúng tôi sẽ liên hệ sớm.');
            setBookingForm({ fullName: '', email: '', phone: '', notes: '' });
            setPeople(1);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Đặt tour thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    const openVideo = (url: string) => {
        setSelectedVideo(url);
        setShowVideoModal(true);
    };

    const openGallery = () => {
        setShowGalleryModal(true);
    };

    const nextImage = () => {
        const allImages = [tour!.imageUrl, ...(detail?.additionalImages || [])];
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        const allImages = [tour!.imageUrl, ...(detail?.additionalImages || [])];
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-cyan-600"></div>
            </div>
        );
    }

    if (!tour) {
        return (
            <div className="text-center p-10 text-red-500 text-xl">
                Tour không tồn tại
            </div>
        );
    }

    const allImages = [tour.imageUrl, ...(detail?.additionalImages || [])];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative h-[600px] bg-gray-100 overflow-hidden flex items-center">
                <img
                    src={allImages[currentImageIndex]}
                    alt={tour.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/1600x500?text=Tour+Image'; }}
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

                {/* Tour Info Overlay - Trung tâm bên trái */}
                <div className="relative z-10 text-white px-8 md:px-16 lg:px-24 max-w-3xl">
                    {/* Status Badge - Ngay trên tên tour */}
                    <div className="mb-6">
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${tour.status === 'ACTIVE' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                            {tour.status === 'ACTIVE' ? '✓ Đang mở đặt' : '⏸ Tạm dừng'}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 drop-shadow-lg">{tour.name}</h1>

                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="px-4 py-2 bg-blue-600 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                            <MapPin size={16} />
                            Địa điểm: {tour.destinationName}
                        </span>
                        <span className="px-4 py-2 bg-orange-500 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                            <Clock size={16} />
                            Thời gian: {tour.duration}
                        </span>
                        <span className="px-4 py-2 bg-green-600 rounded-full text-sm font-medium shadow-lg">
                            Giá: {formatCurrency(tour.price)}
                        </span>
                    </div>

                    <div className="flex items-center gap-6 mb-6">
                        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={18}
                                    className={i < tour.averageRating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-400 text-gray-400'}
                                />
                            ))}
                            <span className="ml-1 text-sm font-medium">({reviews.length} đánh giá)</span>
                        </div>
                        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                            <Eye size={18} />
                            <span className="text-sm font-medium">Lượt xem: 6249</span>
                        </div>
                    </div>
                </div>

                {/* Button Album & Video - Góc dưới trái */}
                <div className="absolute bottom-6 left-6 flex gap-2 z-10">
                    <button
                        onClick={openGallery}
                        className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg flex items-center gap-2 font-medium hover:bg-white transition shadow-lg"
                    >
                        Album
                    </button>
                    {detail?.videos && detail.videos.length > 0 && (
                        <button
                            onClick={() => openVideo(detail.videos[0])}
                            className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg flex items-center gap-2 font-medium hover:bg-white transition shadow-lg"
                        >
                            <Play size={18} /> Video
                        </button>
                    )}
                </div>

                {/* Thumbnail Grid - Bên phải */}
                {allImages.length > 1 && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 grid grid-cols-2 gap-3 z-10">
                        {allImages.slice(0, 4).map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                className="w-32 h-32 object-cover rounded-xl cursor-pointer hover:opacity-75 hover:scale-105 transition-all duration-300 shadow-lg border-2 border-white/50"
                                alt={`Thumbnail ${idx + 1}`}
                                onClick={() => setCurrentImageIndex(idx)}
                                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/200?text=Image'; }}
                            />
                        ))}
                    </div>
                )}

                {/* Navigation Arrows */}
                {allImages.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm text-gray-900 rounded-full hover:bg-white transition shadow-lg z-10">
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm text-gray-900 rounded-full hover:bg-white transition shadow-lg z-10">
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Nội dung chính */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Giới thiệu tour */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl p-8 shadow-sm"
                        >
                            <h1 className="text-3xl font-bold mb-4">{tour.name}</h1>

                            <p className="text-gray-700 leading-relaxed text-base mb-8">
                                {tour.description || 'Hãy để sách hướng dẫn ở nhà và hòa mình vào những nền văn hóa địa phương làm cho mỗi điểm đến trở nên đặc biệt. Chúng tôi sẽ kết nối bạn với những trải nghiệm độc quyền của chúng tôi. Mỗi chuyến đi được chế tác cẩn thận để bạn tận hưởng kỳ nghỉ của mình.'}
                            </p>

                            {/* 4 Thông tin tour - Grid đơn giản */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 py-6 border-y border-gray-200 mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Car className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-0.5">Phương tiện</p>
                                        <p className="font-semibold text-gray-900">{detail?.transportation || 'Xe du lịch'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-0.5">Điểm đón</p>
                                        <p className="font-semibold text-gray-900">{detail?.departurePoint || 'Trung tâm TP'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-0.5">Giờ khởi hành</p>
                                        <p className="font-semibold text-gray-900">{detail?.departureTime || '7:00 AM'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Users className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-0.5">Phù hợp với</p>
                                        <p className="font-semibold text-gray-900">{detail?.suitableFor || 'Gia đình'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Giá bao gồm */}
                            <div>
                                <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
                                    <Check className="w-6 h-6 text-green-600" />
                                    Giá Bao Gồm
                                </h2>
                                <div className="space-y-3">
                                    {['Vé máy bay khứ hồi', '3 Đêm Khách Sạn 4★', 'Phương tiện di chuyển trong chuyến đi', '2 Bữa ăn / ngày'].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 pl-3">
                                            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Những điều cần biết */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl p-8 shadow-sm"
                        >
                            <h2 className="text-2xl font-bold mb-4">Những Điều Cần Biết</h2>
                            <p className="text-gray-700 mb-6">
                                Khám phá những trải nghiệm tuyệt vời với tour của chúng tôi. Mỗi điểm đến được chọn lọc kỹ càng để mang đến những khoảnh khắc đáng nhớ nhất cho bạn.
                            </p>
                            <div className="space-y-3">
                                {['Tham quan các điểm nổi tiếng', 'Trải nghiệm văn hóa địa phương', 'Khám phá ẩm thực đặc sản', 'Hoạt động vui chơi giải trí'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full border-2 border-gray-800 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                                        </div>
                                        <span className="text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Lịch trình */}
                        {detail?.itinerary && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-xl p-8 shadow-sm"
                            >
                                <h2 className="text-2xl font-bold mb-6">Lịch Trình</h2>
                                <ItineraryAccordion itineraryHtml={detail.itinerary} />
                            </motion.div>
                        )}

                        {/* FAQ */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-xl p-8 shadow-sm"
                        >
                            <h2 className="text-2xl font-bold mb-6">Câu Hỏi Thường Gặp</h2>
                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="border-b border-gray-200 last:border-0">
                                        <button
                                            onClick={() => setExpandedFaq(expandedFaq === index ? -1 : index)}
                                            className="w-full py-4 flex items-center justify-between text-left"
                                        >
                                            <span className="font-semibold text-lg">{faq.question}</span>
                                            {expandedFaq === index ? (
                                                <ChevronUp className="w-5 h-5 flex-shrink-0" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 flex-shrink-0" />
                                            )}
                                        </button>
                                        {expandedFaq === index && (
                                            <div className="pb-4 text-gray-600">
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Đánh giá */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-xl p-8 shadow-sm"
                        >
                            <h2 className="text-2xl font-bold mb-6">Đánh Giá Từ Khách Hàng</h2>
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div key={review.id} className="flex gap-4 p-4 rounded-xl bg-gray-50">
                                        <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                                            {review.userName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-semibold">{review.userName}</p>
                                                <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                                            </div>
                                            <div className="flex gap-1 mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={16}
                                                        className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-sm">{review.comment}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 space-y-6">
                            {/* Thẻ Đặt Tour */}
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="text-gray-600">Từ</span>
                                    <span className="text-3xl font-bold text-cyan-600">{formatCurrency(tour.price)}</span>
                                </div>

                                <div className="border-b border-gray-200 mb-6">
                                    <div className="flex gap-4 mb-4">
                                        <button
                                            onClick={() => setActiveTab('booking')}
                                            className={`pb-2 font-medium ${activeTab === 'booking' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                                        >
                                            Form Đặt Tour
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('enquiry')}
                                            className={`pb-2 font-medium ${activeTab === 'enquiry' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                                        >
                                            Form Tư Vấn
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="flex items-center gap-2 text-gray-700 mb-2">
                                            <Calendar className="w-5 h-5 text-blue-600" />
                                            Ngày
                                        </label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Còn trống: {tour.maxParticipants - tour.totalParticipants} chỗ</p>
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 text-gray-700 mb-2">
                                            <Users className="w-5 h-5 text-blue-600" />
                                            Số Người
                                        </label>
                                        <select
                                            value={people}
                                            onChange={(e) => setPeople(Number(e.target.value))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            {[...Array(Math.min(8, tour.maxParticipants - tour.totalParticipants))].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>{i + 1} Người</option>
                                            ))}
                                        </select>
                                    </div>

                                    <input
                                        type="text"
                                        placeholder="Họ tên *"
                                        value={bookingForm.fullName}
                                        onChange={(e) => setBookingForm({ ...bookingForm, fullName: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email *"
                                        value={bookingForm.email}
                                        onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Số điện thoại *"
                                        value={bookingForm.phone}
                                        onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                    <textarea
                                        placeholder="Ghi chú (tùy chọn)"
                                        rows={3}
                                        value={bookingForm.notes}
                                        onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                                    />

                                    <button
                                        onClick={handleBooking}
                                        disabled={submitting}
                                        className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                                    >
                                        {submitting ? 'Đang xử lý...' : 'TIẾN HÀNH ĐẶT TOUR'}
                                    </button>

                                    <div className="flex items-center justify-between pt-4">
                                        <button
                                            onClick={() => setSavedToWishlist(!savedToWishlist)}
                                            className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition"
                                        >
                                            <Heart className={`w-5 h-5 ${savedToWishlist ? 'fill-red-600 text-red-600' : ''}`} />
                                            Lưu Vào Yêu Thích
                                        </button>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Eye className="w-5 h-5" />
                                            <span>6249</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Đặt Với Tự Tin */}
                            <div className={`rounded-xl p-6 shadow-sm`}>
                                <h3 className="text-xl font-bold mb-4">Đặt Với Tự Tin</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            👍
                                        </div>
                                        <div>
                                            <p className="font-medium">Đảm bảo giá tốt nhất</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            📞
                                        </div>
                                        <div>
                                            <p className="font-medium">Chăm sóc khách hàng 24/7</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            ⭐
                                        </div>
                                        <div>
                                            <p className="font-medium">Tour & Hoạt Động Chọn Lọc</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            🛡️
                                        </div>
                                        <div>
                                            <p className="font-medium">Bảo Hiểm Du Lịch Miễn Phí</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cần Trợ Giúp */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-900">
                                <h3 className="text-xl font-bold mb-4">Cần Trợ Giúp?</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5" />
                                        <span>1.8445.3356.33</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5" />
                                        <span>Help@goodlayers.com</span>
                                    </div>
                                </div>
                            </div>

                            {/* Huy Hiệu Hoạt Động */}
                            <div className="bg-gray-900 text-white rounded-xl p-4 flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    👥
                                </div>
                                <div>
                                    <p className="font-medium">{tour.totalParticipants} du khách đã đặt tour này</p>
                                    <p className="text-sm text-gray-300">Đặt ngay hôm nay!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Modal */}
            <AnimatePresence>
                {showGalleryModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowGalleryModal(false)}
                    >
                        <div className="relative max-w-7xl w-full mt-10" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => setShowGalleryModal(false)} className="absolute -top-12 right-0 text-white hover:text-gray-300 transition z-10">
                                <X size={32} />
                            </button>

                            <div className="relative">
                                <motion.img
                                    key={currentImageIndex}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    src={allImages[currentImageIndex]}
                                    alt={`Ảnh ${currentImageIndex + 1}`}
                                    className="w-full max-h-[70vh] object-contain rounded-xl"
                                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/1200x800?text=Image'; }}
                                />

                                {allImages.length > 1 && (
                                    <>
                                        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition">
                                            <ChevronLeft size={28} />
                                        </button>
                                        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition">
                                            <ChevronRight size={28} />
                                        </button>
                                    </>
                                )}

                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                                    {currentImageIndex + 1} / {allImages.length}
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-6 md:grid-cols-8 gap-3 max-h-32 overflow-y-auto">
                                {allImages.map((img, idx) => (
                                    <motion.img
                                        key={idx}
                                        src={img}
                                        alt={`Thumbnail ${idx + 1}`}
                                        whileHover={{ scale: 1.05 }}
                                        className={`w-full aspect-square object-cover rounded-lg cursor-pointer transition ${idx === currentImageIndex ? 'ring-4 ring-blue-500 opacity-100' : 'opacity-60 hover:opacity-100'}`}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=Img'; }}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Video Modal */}
            <AnimatePresence>
                {showVideoModal && selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowVideoModal(false)}
                    >
                        <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => setShowVideoModal(false)} className="absolute -top-12 right-0 text-white hover:text-gray-300 transition">
                                <X size={32} />
                            </button>
                            <video src={selectedVideo} controls autoPlay className="w-full rounded-xl" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TourDetailUserPage;