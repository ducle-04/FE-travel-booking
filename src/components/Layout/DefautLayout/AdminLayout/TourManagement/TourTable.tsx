import React from 'react';
import { MapPin, Calendar, DollarSign, Eye, Edit2, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

interface Tour {
    id: number;
    name: string;
    imageUrl: string;
    destinationName: string;
    duration: string;
    price: number;
    description: string;
    averageRating: number;
    maxParticipants: number;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    bookingsCount: number;
    reviewsCount: number;
}

interface TourTableProps {
    tours: Tour[];
    theme: string;
    onEdit: (tour: Tour) => void;
    onDelete: (id: number) => Promise<void>;
    formatCurrency: (amount: number) => string;
    loading?: boolean;
}

const TourTable: React.FC<TourTableProps> = ({
    tours,
    theme,
    onEdit,
    onDelete,
    formatCurrency,
}) => {
    const navigate = useNavigate();

    const handleDelete = async (id: number, name: string) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa tour',
            text: `Bạn có chắc muốn xóa tour "${name}"? Hành động này không thể hoàn tác.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
            reverseButtons: true,
            customClass: {
                popup: theme === 'dark' ? 'swal2-dark' : '',
                title: theme === 'dark' ? 'text-gray-200' : 'text-gray-800',
                htmlContainer: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
                confirmButton: theme === 'dark' ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white',
                cancelButton: theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-800',
            },
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
        });

        if (result.isConfirmed) {
            try {
                await onDelete(id);
                toast.success(`Xóa tour "${name}" thành công!`, {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: theme === 'dark' ? 'dark' : 'light',
                });
            } catch (error: any) {
                toast.error(error.message || 'Không thể xóa tour. Vui lòng thử lại.', {
                    position: 'top-right',
                    autoClose: 5000,
                    theme: theme === 'dark' ? 'dark' : 'light',
                });
            }
        }
    };

    return (
        <div className={`rounded-2xl overflow-hidden border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-slate-50'}`}>
                        <tr>
                            <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                                #
                            </th>
                            <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                                Hình ảnh
                            </th>
                            <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                                Tên Tour
                            </th>
                            <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                                Điểm đến
                            </th>
                            <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                                Thời gian
                            </th>
                            <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                                Giá
                            </th>
                            <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                                Trạng thái
                            </th>
                            <th className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-slate-200'}`}>
                        {tours.map((tour, index) => (
                            <tr
                                key={tour.id}
                                className={`transition-colors ${theme === 'dark' ? 'hover:bg-gray-750' : 'hover:bg-slate-50'}`}
                            >
                                <td className="px-4 py-3">
                                    <div className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {index + 1}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <img
                                        src={tour.imageUrl}
                                        alt={tour.name}
                                        className="w-16 h-16 rounded-lg object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/64?text=IMG';
                                        }}
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <div className={`font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                                        {tour.name}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className={`flex items-center text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <MapPin size={14} className={`mr-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                                        {tour.destinationName}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className={`flex items-center text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <Calendar size={14} className={`mr-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                                        {tour.duration}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className={`flex items-center text-sm font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                                        <DollarSign size={14} className="mr-1" />
                                        {formatCurrency(tour.price)}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${tour.status === 'ACTIVE'
                                        ? (theme === 'dark' ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-700')
                                        : (theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-700')}`}>
                                        {tour.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm dừng'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-center gap-1">
                                        <button
                                            onClick={() => navigate(`/admin/tours/${tour.id}`)}
                                            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-blue-900 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}
                                            title="Xem chi tiết"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => onEdit(tour)}
                                            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-green-900 text-green-400' : 'hover:bg-green-50 text-green-600'}`}
                                            title="Chỉnh sửa"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(tour.id, tour.name)}
                                            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-red-900 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                                            title="Xóa"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {tours.length === 0 && (
                <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    <p className="text-lg font-medium">Không có tour nào</p>
                    <p className="text-sm mt-1">Hãy thêm tour mới để bắt đầu</p>
                </div>
            )}
        </div>
    );
};

export default TourTable;