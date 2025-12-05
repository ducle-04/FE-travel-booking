import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Check, X, ChevronDown, ChevronUp, Star,
    Play, ChevronLeft, ChevronRight, Car, MapPin, Clock, Hotel as HotelIcon,
    Waves, Trees, Landmark, Utensils, Tag, Calendar, Plane, Train, Bus
} from 'lucide-react';
import { toast } from 'react-toastify';

// Components
import ItineraryAccordion from "../../components/Layout/DefautLayout/UserLayout/Tour/ItineraryAccordion";
import UserHotelModal from "../../components/Layout/DefautLayout/UserLayout/Tour/UserHotelModal";
import TourBookingCard from "../../components/Layout/DefautLayout/UserLayout/Tour/TourBookingCard";

// Services
import { fetchTourDetail, fetchStartDateAvailability } from '../../services/tourDetailService';
import type { StartDateAvailability } from '../../services/tourDetailService';

// Types
interface TransportDTO { name: string; price: number; }
interface HotelDTO { id: number; name: string; address: string; starRating: string; description?: string; images: string[]; videos?: string[]; }
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
    startDates?: string[];
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
    const [selectedHotel, setSelectedHotel] = useState<HotelDTO | null>(null);

    const [date, setDate] = useState<string>('');
    const [people, setPeople] = useState<number>(1);
    const [notes, setNotes] = useState<string>('');
    const [startDateAvailability, setStartDateAvailability] = useState<StartDateAvailability[]>([]);

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

            // 📌 Lấy ngày khởi hành có số chỗ trống
            const dates = await fetchStartDateAvailability(id!);
            setStartDateAvailability(dates);

            // Tự chọn ngày gần nhất còn chỗ
            const availableDates = dates.filter(d => d.available);
            if (availableDates.length > 0) {
                setDate(availableDates[0].date);
            }
        } catch (error: any) {
            toast.error(error.message || 'Không thể tải chi tiết tour');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tour?.startDates && tour.startDates.length > 0) {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const futureDates = tour.startDates
                .map(d => new Date(d))
                .filter(d => d >= now)
                .sort((a, b) => a.getTime() - b.getTime());
            if (futureDates.length > 0) {
                setDate(futureDates[0].toISOString().split('T')[0]);
            }
        }
    }, [tour?.startDates]);

    const openVideo = (url: string) => { setSelectedVideo(url); setShowVideoModal(true); };
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
    if (!tour) return <div className="text-center p-10 text-red-500 text-xl">Tour không tồn tại</div>;

    const allImages = [tour.imageUrl, ...(detail?.additionalImages || [])];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative h-[690px] bg-gray-100 overflow-hidden flex items-center">
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

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 drop-shadow-lg">{tour.name}</h1>

                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="px-4 py-2 bg-blue-600 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                            <MapPin size={16} /> {tour.destinationName}
                        </span>
                        <span className="px-4 py-2 bg-orange-500 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                            <Clock size={16} /> {tour.duration}
                        </span>
                        <span className="px-4 py-2 bg-green-600 rounded-full text-sm font-medium shadow-lg">
                            Từ {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.price)} / người
                        </span>
                    </div>

                    {/* DANH SÁCH NGÀY KHỞI HÀNH - ĐẸP & CHỌN ĐƯỢC */}
                    {startDateAvailability.length > 0 && (
                        <div className="mb-8">
                            <p className="text-white text-sm font-medium mb-4 opacity-90 flex items-center gap-2">
                                <Calendar size={18} /> Chọn ngày khởi hành:
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {startDateAvailability.map((item, index) => {
                                    const isSelected = date === item.date;
                                    const disabled = !item.available;

                                    return (
                                        <button
                                            key={index}
                                            disabled={disabled}
                                            onClick={() => setDate(item.date)}
                                            className={`
                            px-6 py-3.5 rounded-xl font-medium text-sm transition-all shadow-lg border-2
                            ${isSelected
                                                    ? 'bg-white text-gray-900 border-white scale-105 shadow-xl'
                                                    : 'bg-white/20 backdrop-blur-md text-white border-white/40 hover:bg-white/35 hover:border-white/70'
                                                }
                            ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
                        `}
                                        >
                                            {item.formattedDate}
                                            <div className="text-xs mt-1 opacity-80">
                                                {item.available
                                                    ? `Còn ${item.remainingSeats} chỗ`
                                                    : 'Hết chỗ'}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-5 text-white">
                                <span className="text-sm opacity-80">Ngày đã chọn:</span>
                                <span className="ml-3 text-xl font-bold bg-white/25 backdrop-blur px-6 py-3 rounded-full">
                                    {date
                                        ? startDateAvailability.find(d => d.date === date)?.formattedDate
                                        : 'Chưa chọn ngày'}
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center gap-6 mb-14">
                        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={18} className={i < Math.round(tour.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-400 text-gray-400'} />
                            ))}
                            <span className="ml-1 text-sm font-medium">({tour.reviewsCount} đánh giá)</span>
                        </div>
                    </div>
                </div>

                {/* Các nút xem ảnh/video */}
                <div className="absolute bottom-6 left-6 flex gap-4 z-10">
                    <button onClick={openGallery} className="px-5 py-3 bg-white/90 backdrop-blur text-gray-900 rounded-lg flex items-center gap-2 font-medium hover:bg-white transition shadow-lg">
                        Album ảnh
                    </button>
                    {detail?.videos && detail.videos.length > 0 && (
                        <button onClick={() => openVideo(detail.videos[0])} className="px-5 py-3 bg-white/90 backdrop-blur text-gray-900 rounded-lg flex items-center gap-2 font-medium hover:bg-white transition shadow-lg">
                            <Play size={18} /> Xem video
                        </button>
                    )}
                </div>

                {/* Thumbnail ảnh nhỏ */}
                {allImages.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur text-gray-900 rounded-full hover:bg-white transition shadow-lg z-30">
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur text-gray-900 rounded-full hover:bg-white transition shadow-lg z-30">
                            <ChevronRight size={24} />
                        </button>
                    </>
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

                            {/* Hotels */}
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

                            {/* Giá tour đã bao gồm */}
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

                    {/* Right Column - DÙNG COMPONENT MỚI */}
                    <div className="lg:col-span-1">
                        <TourBookingCard
                            tourId={tour.id}
                            tourName={tour.name}
                            price={tour.price}
                            maxParticipants={tour.maxParticipants}
                            totalParticipants={tour.totalParticipants}
                            startDates={tour.startDates || []}
                            transports={detail?.transports?.map(t => ({
                                name: t.name,
                                price: t.price,
                                icon: t.name.includes('Máy bay') ? <Plane className="w-5 h-5" /> :
                                    t.name.includes('Tàu') ? <Train className="w-5 h-5" /> :
                                        t.name.includes('Limousine') ? <Bus className="w-5 h-5" /> :
                                            <Car className="w-5 h-5" />
                            })) || []}
                            date={date}
                            setDate={setDate}
                            people={people}
                            setPeople={setPeople}
                            notes={notes}
                            setNotes={setNotes}
                            onBooking={() => {
                                setPeople(1);
                                setNotes('');
                                fetchTourDetailData();
                            }}
                            savedToWishlist={savedToWishlist}
                            setSavedToWishlist={setSavedToWishlist}
                        />
                    </div>
                </div>
            </div>

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

            {/* Hotel Modal */}
            <UserHotelModal
                isOpen={!!selectedHotel}
                onClose={() => setSelectedHotel(null)}
                hotel={selectedHotel}
            />
        </div>
    );
};

export default TourDetailUserPage;