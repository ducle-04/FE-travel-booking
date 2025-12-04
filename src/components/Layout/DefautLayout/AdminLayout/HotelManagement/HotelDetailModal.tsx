import React from 'react';
import { X, Star, MapPin, Hotel, Video, Image } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    hotel: any;
    theme: 'light' | 'dark';
    openImageModal: (url: string) => void;
    openVideoModal: (url: string) => void;
}

const HotelDetailModal: React.FC<Props> = ({ isOpen, onClose, hotel, theme, openImageModal, openVideoModal }) => {
    if (!isOpen || !hotel) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-black/80' : 'bg-black/60'} backdrop-blur-sm`}>
            <div className={`w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                {/* Header cố định */}
                <div className={`sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                    <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Chi Tiết Khách Sạn</h2>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg transition ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                    >
                        <X size={24} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
                    </button>
                </div>

                {/* Nội dung cuộn */}
                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    {/* Hero Section với ảnh lớn */}
                    {hotel.images?.[0] && (
                        <div className="relative h-80 overflow-hidden">
                            <img
                                src={hotel.images[0]}
                                alt={hotel.name}
                                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                                onClick={() => openImageModal(hotel.images[0])}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Thông tin cơ bản trên ảnh */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">{hotel.name}</h1>
                                <div className="flex items-center gap-2 mb-3">
                                    <MapPin size={18} className="text-blue-400" />
                                    <p className="text-lg drop-shadow">{hotel.address}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={20}
                                            className={i < hotel.starRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}
                                        />
                                    ))}
                                    <span className="ml-2 text-lg font-semibold">{hotel.starRating} sao</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content Area */}
                    <div className="p-6 space-y-6">
                        {/* Nếu không có ảnh hero, hiển thị thông tin header truyền thống */}
                        {!hotel.images?.[0] && (
                            <div className="flex items-start gap-6 pb-6 border-b dark:border-gray-800">
                                <div className={`w-32 h-32 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    <Hotel size={48} className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} />
                                </div>
                                <div className="flex-1">
                                    <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{hotel.name}</h1>
                                    <div className="flex items-center gap-2 mb-3">
                                        <MapPin size={20} className="text-blue-600" />
                                        <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{hotel.address}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={22}
                                                className={i < hotel.starRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                                            />
                                        ))}
                                        <span className={`ml-2 text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{hotel.starRating} sao</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mô tả */}
                        {hotel.description && (
                            <div className={`p-5 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                                <h3 className={`text-lg font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Giới thiệu</h3>
                                <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {hotel.description}
                                </p>
                            </div>
                        )}

                        {/* Hình ảnh Gallery */}
                        {hotel.images && hotel.images.length > 1 && (
                            <div>
                                <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    <Image size={22} className="text-blue-600" />
                                    Thư viện ảnh ({hotel.images.length})
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {hotel.images.map((url: string, i: number) => (
                                        <div
                                            key={i}
                                            className="relative group overflow-hidden rounded-lg cursor-pointer aspect-square"
                                            onClick={() => openImageModal(url)}
                                        >
                                            <img
                                                src={url}
                                                alt={`Ảnh ${i + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Video */}
                        {hotel.videos && hotel.videos.length > 0 && (
                            <div>
                                <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    <Video size={22} className="text-purple-600" />
                                    Video giới thiệu ({hotel.videos.length})
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {hotel.videos.map((url: string, i: number) => (
                                        <div key={i} className="rounded-lg overflow-hidden shadow-lg">
                                            <video
                                                src={url}
                                                controls
                                                className="w-full h-64 object-cover"
                                                onClick={() => openVideoModal(url)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Footer - Trạng thái */}
                        <div className={`flex items-center justify-between pt-4 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                            <div className="flex items-center gap-2">
                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Trạng thái:</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${hotel.status === 'ACTIVE'
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                    {hotel.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm dừng'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetailModal;