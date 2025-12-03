import React from 'react';
import { X, MapPin, Clock, DollarSign, Star, Users, CalendarCheck, UserCheck, CalendarDays } from 'lucide-react';

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
}

interface TourDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    tour: Tour;
    theme: string;
    formatCurrency: (amount: number) => string;
}

const TourDetailModal: React.FC<TourDetailModalProps> = ({ isOpen, onClose, tour, theme, formatCurrency }) => {
    if (!isOpen) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-black/70' : 'bg-black/50'}`}>
            <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-xl ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                {/* Header */}
                <div className={`sticky top-0 flex items-center justify-between p-5 border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Chi Tiết Tour</h2>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                    >
                        <X size={22} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Ảnh + Tên + Trạng thái */}
                    <div className="relative rounded-xl overflow-hidden">
                        <img
                            src={tour.imageUrl}
                            alt={tour.name}
                            className="w-full h-64 object-cover"
                            onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Ảnh+Tour';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                            <h1 className="text-3xl font-bold drop-shadow-lg">{tour.name}</h1>
                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${tour.status === 'ACTIVE'
                                ? 'bg-emerald-500/90 text-white'
                                : 'bg-gray-500/90 text-white'
                                }`}>
                                {tour.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm dừng'}
                            </span>
                        </div>
                    </div>

                    {/* Thông tin chính - 2 cột */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoCard icon={MapPin} label="Điểm đến" value={tour.destinationName} color="blue" theme={theme} />
                        <InfoCard icon={Clock} label="Thời gian" value={tour.duration} color="green" theme={theme} />
                        <InfoCard icon={DollarSign} label="Giá tour" value={formatCurrency(tour.price)} color="purple" theme={theme} bold />
                        <InfoCard icon={Star} label="Đánh giá" value={`${tour.averageRating}/5 (${tour.reviewsCount} lượt)`} color="yellow" theme={theme} />
                    </div>

                    {/* Mô tả */}
                    <div className={`p-5 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                        <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                            Mô tả tour
                        </h3>
                        <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {tour.description || 'Chưa có mô tả chi tiết.'}
                        </p>
                    </div>

                    {/* Thống kê nhỏ - 4 ô */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatBox icon={Users} label="Tổng khách" value={tour.totalParticipants} color="indigo" theme={theme} />
                        <StatBox icon={CalendarCheck} label="Đã đặt" value={tour.bookingsCount} color="emerald" theme={theme} />
                        <StatBox icon={UserCheck} label="Tối đa" value={tour.maxParticipants} color="orange" theme={theme} />
                        <StatBox icon={CalendarDays} label="Tạo ngày" value={formatDate(tour.createdAt)} color="teal" theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Component con nhỏ gọn
const InfoCard = ({ icon: Icon, label, value, color, theme, bold = false }: any) => (
    <div className={`flex items-start gap-3 p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
        <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-500`}>
            <Icon size={20} />
        </div>
        <div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
            <p className={`font-medium ${bold ? 'text-lg font-bold' : ''} ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {value}
            </p>
        </div>
    </div>
);

const StatBox = ({ icon: Icon, label, value, color, theme }: any) => (
    <div className={`text-center p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
        <div className={`flex justify-center mb-2 text-${color}-500`}>
            <Icon size={20} />
        </div>
        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
        <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value}</p>
    </div>
);

export default TourDetailModal;