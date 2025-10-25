import React from 'react';
import { Edit2, Trash2, MapPin, ImageIcon } from 'lucide-react';
import { useTheme } from '../../../../../context/ThemeContext';
import Swal from 'sweetalert2'; // Nhập SweetAlert2
import { toast } from 'react-toastify'; // Nhập react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Nhập CSS cho react-toastify

interface Destination {
    id: string;
    name: string;
    region: 'Bắc' | 'Trung' | 'Nam';
    description: string;
    imageUrl: string;
    toursCount: number;
    status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
}

interface DestinationTableProps {
    destinations: Destination[];
    currentPage: number;
    itemsPerPage: number;
    onOpenModal: (destination?: Destination) => void;
    onDelete: (id: string) => Promise<void>; // Cập nhật để trả về Promise
    onOpenImageModal: (imageUrl: string) => void;
}

const DestinationTable: React.FC<DestinationTableProps> = ({
    destinations,
    currentPage,
    itemsPerPage,
    onOpenModal,
    onDelete,
    onOpenImageModal,
}) => {
    const { theme } = useTheme();

    const getRegionColor = (region: string) => {
        switch (region) {
            case 'Bắc':
                return theme === 'dark' ? 'bg-blue-900 text-blue-200 border border-blue-700' : 'bg-blue-100 text-blue-800 border border-blue-200';
            case 'Trung':
                return theme === 'dark' ? 'bg-amber-900 text-amber-200 border border-amber-700' : 'bg-amber-100 text-amber-800 border border-amber-200';
            case 'Nam':
                return theme === 'dark' ? 'bg-emerald-900 text-emerald-200 border border-emerald-700' : 'bg-emerald-100 text-emerald-800 border border-emerald-200';
            default:
                return theme === 'dark' ? 'bg-gray-800 text-gray-200 border border-gray-700' : 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    // Hàm xử lý xóa với xác nhận
    const handleDelete = async (id: string, name: string) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa điểm đến',
            text: `Bạn có chắc muốn xóa điểm đến "${name}"? Hành động này không thể hoàn tác.`,
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
                toast.success(`Xóa điểm đến "${name}" thành công!`, {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: theme === 'dark' ? 'dark' : 'light',
                });
            } catch (error: any) {
                toast.error(error.message || 'Không thể xóa điểm đến. Vui lòng thử lại.', {
                    position: 'top-right',
                    autoClose: 5000,
                    theme: theme === 'dark' ? 'dark' : 'light',
                });
            }
        }
    };

    return (
        <div className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className={`border-b ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-slate-50 border-slate-200'}`}>
                        <tr>
                            <th className={`text-center px-4 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'} w-16`}>STT</th>
                            <th className={`text-center px-4 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'} w-24`}>Ảnh</th>
                            <th className={`text-left px-6 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>Tên điểm đến</th>
                            <th className={`text-center px-4 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'} w-28`}>Khu vực</th>
                            <th className={`text-left px-6 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>Mô tả</th>
                            <th className={`text-center px-4 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'} w-28`}>Số tour</th>
                            <th className={`text-center px-4 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'} w-32`}>Trạng thái</th>
                            <th className={`text-center px-6 py-4 text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'} w-32`}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-slate-100'}`}>
                        {destinations.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-12">
                                    <MapPin className={`mx-auto mb-2 ${theme === 'dark' ? 'text-gray-600' : 'text-slate-400'}`} size={48} />
                                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}>Không tìm thấy điểm đến nào</p>
                                </td>
                            </tr>
                        ) : (
                            destinations.map((destination, index) => (
                                <tr key={destination.id} className={`transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-slate-50'}`}>
                                    <td className={`px-4 py-4 text-center font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex justify-center">
                                            {destination.imageUrl ? (
                                                <button
                                                    onClick={() => onOpenImageModal(destination.imageUrl)}
                                                    className="focus:outline-none"
                                                >
                                                    <img
                                                        src={destination.imageUrl}
                                                        alt={destination.name}
                                                        className={`w-16 h-16 rounded-lg object-cover border ${theme === 'dark' ? 'border-gray-600 hover:opacity-80' : 'border-slate-200 hover:opacity-80'} transition-opacity`}
                                                    />
                                                </button>
                                            ) : (
                                                <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-slate-100 border-slate-200'}`}>
                                                    <ImageIcon className={theme === 'dark' ? 'text-gray-500' : 'text-slate-400'} size={24} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-slate-800'}`}>
                                        {destination.name}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getRegionColor(destination.region)}`}>
                                            {destination.region}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-sm max-w-md ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                                        {destination.description}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className={`inline-flex items-center justify-center w-12 h-12 rounded-xl font-bold ${theme === 'dark' ? 'bg-blue-900 text-blue-200 border border-blue-700' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                                            {destination.toursCount}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${destination.status === 'ACTIVE'
                                            ? theme === 'dark' ? 'bg-emerald-900 text-emerald-200 border border-emerald-700' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                            : theme === 'dark' ? 'bg-gray-700 text-gray-300 border border-gray-600' : 'bg-slate-100 text-slate-600 border border-slate-200'
                                            }`}>
                                            {destination.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm ngưng'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => onOpenModal(destination)}
                                                className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-blue-400 hover:bg-blue-900' : 'text-blue-600 hover:bg-blue-50'}`}
                                                title="Chỉnh sửa"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(destination.id, destination.name)} // Sử dụng handleDelete
                                                className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-red-400 hover:bg-red-900' : 'text-red-600 hover:bg-red-50'}`}
                                                title="Xóa"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DestinationTable;