import React, { useState } from 'react';
import { X, ImageIcon, ZoomIn } from 'lucide-react';
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

interface DestinationModalProps {
    isOpen: boolean;
    editingDestination: Destination | null;
    formData: Omit<Destination, 'id'> & { imageFile?: File; imagePreview?: string };
    setFormData: React.Dispatch<React.SetStateAction<Omit<Destination, 'id'> & { imageFile?: File; imagePreview?: string }>>;
    onSubmit: () => Promise<void>;
    onClose: () => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onImageUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onOpenImageModal: (imageUrl: string) => void;
}

const DestinationModal: React.FC<DestinationModalProps> = ({
    isOpen,
    editingDestination,
    formData,
    setFormData,
    onSubmit,
    onClose,
    onFileChange,
    onImageUrlChange,
    onOpenImageModal,
}) => {
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const validateForm = (): string | null => {
        if (!formData.name.trim()) return 'Tên điểm đến không được để trống.';
        if (!formData.region) return 'Vui lòng chọn khu vực.';
        if (!formData.description.trim()) return 'Mô tả không được để trống.';
        if (!editingDestination && !formData.imageFile && !formData.imageUrl.trim()) {
            return 'Vui lòng cung cấp tệp ảnh hoặc URL ảnh.';
        }
        return null;
    };

    const handleSubmit = async () => {
        // Kiểm tra validation
        const error = validateForm();
        if (error) {
            toast.error(error, {
                position: 'top-right',
                autoClose: 5000,
                theme: theme === 'dark' ? 'dark' : 'light',
            });
            return;
        }

        // Hiển thị thông báo xác nhận
        const actionText = editingDestination ? 'cập nhật' : 'thêm';
        const result = await Swal.fire({
            title: `Xác nhận ${actionText} điểm đến`,
            text: `Bạn có chắc muốn ${actionText} điểm đến "${formData.name}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
            reverseButtons: true,
            customClass: {
                popup: theme === 'dark' ? 'swal2-dark' : '',
                title: theme === 'dark' ? 'text-gray-200' : 'text-gray-800',
                htmlContainer: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
                confirmButton: theme === 'dark' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white',
                cancelButton: theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-800',
            },
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
        });

        if (result.isConfirmed) {
            setIsLoading(true);
            try {
                await onSubmit();
                toast.success(`${editingDestination ? 'Cập nhật' : 'Thêm'} điểm đến "${formData.name}" thành công!`, {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: theme === 'dark' ? 'dark' : 'light',
                });
                onClose(); // Đóng modal sau khi thành công
            } catch (error: any) {
                toast.error(error.message || `Không thể ${actionText} điểm đến. Vui lòng thử lại.`, {
                    position: 'top-right',
                    autoClose: 5000,
                    theme: theme === 'dark' ? 'dark' : 'light',
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center p-4 z-50 ${theme === 'dark' ? 'bg-black bg-opacity-75' : 'bg-black bg-opacity-50'}`}>
            <div className={`relative rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
                {isLoading && (
                    <div className={`absolute inset-0 flex items-center justify-center bg-opacity-75 z-10 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                        <div className="flex flex-col items-center gap-2">
                            <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${theme === 'dark' ? 'border-blue-400' : 'border-blue-600'}`}></div>
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                                {editingDestination ? 'Đang cập nhật điểm đến' : 'Đang thêm điểm đến'}
                            </p>
                        </div>
                    </div>
                )}
                <div className={`sticky top-0 border-b px-6 py-4 flex items-center justify-between rounded-t-2xl ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
                    <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-slate-800'}`}>
                        {editingDestination ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến mới'}
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-slate-100'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="space-y-5">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                                Tên điểm đến <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={isLoading}
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-slate-300'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                placeholder="Nhập tên điểm đến"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                                    Khu vực <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.region}
                                    onChange={(e) => setFormData({ ...formData, region: e.target.value as 'Bắc' | 'Trung' | 'Nam' })}
                                    disabled={isLoading}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-slate-300'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <option value="Bắc">Miền Bắc</option>
                                    <option value="Trung">Miền Trung</option>
                                    <option value="Nam">Miền Nam</option>
                                </select>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                                    Trạng thái <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                                    disabled={isLoading}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-slate-300'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <option value="ACTIVE">Hoạt động</option>
                                    <option value="INACTIVE">Tạm ngưng</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                                Tệp ảnh {editingDestination ? '' : <span className="text-red-500">*</span>}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={onFileChange}
                                disabled={isLoading}
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-slate-300'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                                URL ảnh (tùy chọn, sử dụng nếu không tải tệp ảnh)
                            </label>
                            <input
                                type="text"
                                value={formData.imageUrl}
                                onChange={onImageUrlChange}
                                disabled={isLoading}
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-slate-300'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                                Xem trước ảnh
                            </label>
                            <div className="flex items-center gap-2">
                                {formData.imagePreview ? (
                                    <>
                                        <button
                                            onClick={() => onOpenImageModal(formData.imagePreview!)}
                                            className="focus:outline-none"
                                            disabled={isLoading}
                                        >
                                            <img
                                                src={formData.imagePreview}
                                                alt="Preview"
                                                className={`w-32 h-32 rounded-lg object-cover border ${theme === 'dark' ? 'border-gray-600 hover:opacity-80' : 'border-slate-200 hover:opacity-80'} transition-opacity ${isLoading ? 'opacity-50' : ''}`}
                                            />
                                        </button>
                                        <button
                                            onClick={() => onOpenImageModal(formData.imagePreview!)}
                                            disabled={isLoading}
                                            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-blue-400 hover:bg-blue-900' : 'text-blue-600 hover:bg-blue-50'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            title="Xem ảnh lớn"
                                        >
                                            <ZoomIn size={18} />
                                        </button>
                                    </>
                                ) : (
                                    <div className={`w-32 h-32 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-slate-100 border-slate-200'}`}>
                                        <ImageIcon className={theme === 'dark' ? 'text-gray-500' : 'text-slate-400'} size={32} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                                Mô tả <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                disabled={isLoading}
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-slate-300'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                placeholder="Nhập mô tả về điểm đến"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className={`flex-1 px-6 py-3 border rounded-xl font-medium transition-all ${theme === 'dark' ? 'text-gray-200 border-gray-600 hover:bg-gray-700' : 'text-slate-700 border-slate-300 hover:bg-slate-50'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all ${theme === 'dark' ? 'bg-gradient-to-r from-blue-700 to-blue-800 text-white hover:from-blue-800 hover:to-blue-900' : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                    {editingDestination ? 'Đang cập nhật' : 'Đang thêm'}
                                </div>
                            ) : (
                                editingDestination ? 'Cập nhật' : 'Thêm mới'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DestinationModal;