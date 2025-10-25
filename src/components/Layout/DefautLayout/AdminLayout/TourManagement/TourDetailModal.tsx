import React from 'react';
import { X, MapPin, Calendar, DollarSign, Star } from 'lucide-react';

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

    return (
        <div className={`fixed inset-0 flex items-center justify-center p-4 z-50 ${theme === 'dark' ? 'bg-black bg-opacity-75' : 'bg-black bg-opacity-50'}`}>
            <div className={`rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
                <div className={`sticky top-0 border-b px-6 py-4 flex items-center justify-between rounded-t-2xl ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
                    <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-slate-800'}`}>Chi Tiết Tour</h2>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-slate-100'}`}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <img
                        src={tour.imageUrl}
                        alt={tour.name}
                        className="w-full h-64 object-cover rounded-xl mb-6"
                    />

                    <div className="space-y-4">
                        <div>
                            <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{tour.name}</h3>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${tour.status === 'ACTIVE' ? (theme === 'dark' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800') : (theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-800')}`}>
                                {tour.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm dừng'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
                                <div className={`flex items-center mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                                    <MapPin size={20} className="mr-2" />
                                    <span className="font-semibold">Điểm Đến</span>
                                </div>
                                <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>{tour.destinationName}</p>
                            </div>

                            <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
                                <div className={`flex items-center mb-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                                    <Calendar size={20} className="mr-2" />
                                    <span className="font-semibold">Thời Gian</span>
                                </div>
                                <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>{tour.duration}</p>
                            </div>

                            <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'}`}>
                                <div className={`flex items-center mb-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                                    <DollarSign size={20} className="mr-2" />
                                    <span className="font-semibold">Giá Tour</span>
                                </div>
                                <p className={`font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{formatCurrency(tour.price)}</p>
                            </div>

                            <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-yellow-50'}`}>
                                <div className={`flex items-center mb-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                    <Star size={20} className="mr-2" />
                                    <span className="font-semibold">Đánh Giá</span>
                                </div>
                                <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>
                                    {tour.averageRating} / 5 ({tour.reviewsCount} đánh giá)
                                </p>
                            </div>
                        </div>

                        <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Mô Tả</h4>
                            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{tour.description}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className={`text-center p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-indigo-50'}`}>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Tổng Khách</p>
                                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>{tour.totalParticipants}</p>
                            </div>
                            <div className={`text-center p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-pink-50'}`}>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Đặt Tour</p>
                                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}`}>{tour.bookingsCount}</p>
                            </div>
                            <div className={`text-center p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-teal-50'}`}>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Ngày Tạo</p>
                                <p className={`text-lg font-bold ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`}>{tour.createdAt}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourDetailModal;