// src/components/Layout/DefautLayout/AdminLayout/HotelManagement/HotelTable.tsx
import React from 'react';
import { Edit2, Trash2, Star, MapPin, Hotel as HotelIcon, Eye } from 'lucide-react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import type { Hotel } from '../../../../../services/hotelService';

interface Props {
    hotels: Hotel[];
    theme: 'light' | 'dark';
    onEdit: (hotel: Hotel) => void;
    onDelete: (id: number) => Promise<void>;
    onViewDetail: (hotel: Hotel) => void; // ← THÊM PROP MỚI
    openImageModal: (url: string) => void;
    openVideoModal: (url: string) => void;
    loading: boolean;
}

const HotelTable: React.FC<Props> = ({
    hotels,
    theme,
    onEdit,
    onDelete,
    onViewDetail, // ← NHẬN PROP
    openImageModal,
    loading
}) => {

    const handleDelete = async (id: number, hotelName: string) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa khách sạn',
            html: `<span class="text-lg">Bạn có chắc muốn xóa khách sạn</span><br/><span class="font-bold text-xl text-red-600">"${hotelName}"</span><br/><span class="text-sm text-gray-500">Hành động này không thể hoàn tác!</span>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa luôn',
            cancelButtonText: 'Hủy',
            reverseButtons: true,
            heightAuto: false,
            customClass: {
                popup: `border border-gray-300 dark:border-gray-600 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`,
                confirmButton: `
                    px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg 
                    transition-all duration-200 transform hover:scale-105
                `,
                cancelButton: `
                    px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl shadow-lg 
                    transition-all duration-200 transform hover:scale-105 ml-3
                `,
            },
            buttonsStyling: false,
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
        });

        if (result.isConfirmed) {
            try {
                await onDelete(id);
                toast.success(`Đã xóa khách sạn "${hotelName}" thành công!`, {
                    theme: theme === 'dark' ? 'dark' : 'light',
                });
            } catch (error: any) {
                toast.error(error.message || 'Xóa thất bại! Có thể khách sạn đang có đặt phòng.', {
                    theme: theme === 'dark' ? 'dark' : 'light',
                });
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    if (hotels.length === 0) {
        return (
            <div className="text-center py-20">
                <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Không tìm thấy khách sạn nào
                </p>
            </div>
        );
    }

    return (
        <div className={`rounded-2xl overflow-hidden border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-xl`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} border-b border-gray-300 dark:border-gray-700`}>
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Ảnh
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Tên khách sạn
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Địa chỉ
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Sao
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {hotels.map((hotel) => (
                            <tr
                                key={hotel.id}
                                className={`hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} transition duration-200`}
                            >
                                {/* Ảnh */}
                                <td className="px-6 py-4">
                                    {hotel.images && hotel.images.length > 0 ? (
                                        <img
                                            src={hotel.images[0]}
                                            alt={hotel.name}
                                            className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition duration-200 shadow-md"
                                            onClick={() => openImageModal(hotel.images[0])}
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://via.placeholder.com/64?text=HOTEL';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center shadow">
                                            <HotelIcon size={28} className="text-gray-400" />
                                        </div>
                                    )}
                                </td>

                                {/* Tên khách sạn */}
                                <td className="px-6 py-4">
                                    <div>
                                        <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {hotel.name}
                                        </p>
                                        {hotel.description && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                                                {hotel.description}
                                            </p>
                                        )}
                                    </div>
                                </td>

                                {/* Địa chỉ */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 max-w-xs">
                                        <MapPin size={16} className="text-blue-600 flex-shrink-0" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                            {hotel.address}
                                        </span>
                                    </div>
                                </td>

                                {/* Số sao */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={18}
                                                className={i < hotel.starRating
                                                    ? 'text-yellow-500 fill-current drop-shadow'
                                                    : 'text-gray-300 dark:text-gray-600'
                                                }
                                            />
                                        ))}
                                        <span className="ml-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            {hotel.starRating} sao
                                        </span>
                                    </div>
                                </td>

                                {/* Trạng thái */}
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide ${hotel.status === 'ACTIVE'
                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}
                                    >
                                        {hotel.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm dừng'}
                                    </span>
                                </td>

                                {/* Hành động – THÊM NÚT XEM CHI TIẾT */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {/* Xem chi tiết */}
                                        <button
                                            onClick={() => onViewDetail(hotel)}
                                            className="p-2.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/40 rounded-lg transition duration-200"
                                            title="Xem chi tiết"
                                        >
                                            <Eye size={18} />
                                        </button>

                                        {/* Chỉnh sửa */}
                                        <button
                                            onClick={() => onEdit(hotel)}
                                            className="p-2.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-lg transition duration-200"
                                            title="Chỉnh sửa"
                                        >
                                            <Edit2 size={18} />
                                        </button>

                                        {/* Xóa */}
                                        <button
                                            onClick={() => handleDelete(hotel.id, hotel.name)}
                                            className="p-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-lg transition duration-200"
                                            title="Xóa khách sạn"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HotelTable;