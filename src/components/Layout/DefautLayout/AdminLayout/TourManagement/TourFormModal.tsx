import React, { useState } from 'react';
import { X, ImageIcon, ZoomIn } from 'lucide-react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
    name: string;
    imageUrl: string;
    destinationName: string;
    duration: string;
    price: string;
    description: string;
    status: 'ACTIVE' | 'INACTIVE';
    maxParticipants: string; // THÊM
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
}

interface TourFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    modalMode: 'add' | 'edit';
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    imageFile: File | null;
    setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
    imagePreview: string | null;
    setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
    selectedTour: Tour | null;
    onSubmit: () => Promise<void>;
    theme: string;
    openImageModal: (imageUrl: string) => void;
}

const TourFormModal: React.FC<TourFormModalProps> = ({
    isOpen,
    onClose,
    modalMode,
    formData,
    setFormData,
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
    onSubmit,
    theme,
    openImageModal,
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = (): string | null => {
        if (!formData.name.trim()) return 'Tên tour không được để trống.';
        if (!formData.destinationName.trim()) return 'Điểm đến không được để trống.';
        if (!formData.duration.trim()) return 'Thời gian không được để trống.';
        if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
            return 'Giá tour phải là số lớn hơn 0.';
        }
        if (!formData.maxParticipants || isNaN(Number(formData.maxParticipants)) || Number(formData.maxParticipants) <= 0) {
            return 'Số người tối đa phải lớn hơn 0.';
        }
        if (!formData.description.trim()) return 'Mô tả không được để trống.';
        if (modalMode === 'add' && !imageFile && !formData.imageUrl.trim()) {
            return 'Vui lòng cung cấp tệp ảnh hoặc URL ảnh.';
        }
        return null;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setImageFile(file);
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setFormData({ ...formData, imageUrl: '' });
        } else {
            setImagePreview(null);
        }
    };

    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setFormData({ ...formData, imageUrl: url });
        setImageFile(null);
        setImagePreview(url || null);
    };

    const handleSubmit = async () => {
        const error = validateForm();
        if (error) {
            toast.error(error, { position: 'top-right', autoClose: 5000, theme: theme === 'dark' ? 'dark' : 'light' });
            return;
        }

        const actionText = modalMode === 'add' ? 'thêm' : 'cập nhật';
        const result = await Swal.fire({
            title: `Xác nhận ${actionText} tour`,
            text: `Bạn có chắc muốn ${actionText} tour "${formData.name}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
            reverseButtons: true,
            customClass: { popup: theme === 'dark' ? 'swal2-dark' : '' },
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
        });

        if (result.isConfirmed) {
            setIsLoading(true);
            try {
                await onSubmit();
                toast.success(`${modalMode === 'add' ? 'Thêm' : 'Cập nhật'} tour "${formData.name}" thành công!`, {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: theme === 'dark' ? 'dark' : 'light',
                });
                onClose();
            } catch (error: any) {
                toast.error(error.message || `Không thể ${actionText} tour. Vui lòng thử lại.`, {
                    position: 'top-right',
                    autoClose: 5000,
                    theme: theme === 'dark' ? 'dark' : 'light',
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 flex items-center justify-center p-4 z-50 ${theme === 'dark' ? 'bg-black bg-opacity-75' : 'bg-black bg-opacity-50'}`}>
            <div className={`rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
                {isLoading && (
                    <div className={`absolute inset-0 flex items-center justify-center bg-opacity-75 z-10 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                        <div className="flex flex-col items-center gap-2">
                            <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${theme === 'dark' ? 'border-blue-400' : 'border-blue-600'}`}></div>
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                                {modalMode === 'add' ? 'Đang thêm tour' : 'Đang cập nhật tour'}
                            </p>
                        </div>
                    </div>
                )}
                <div className={`sticky top-0 border-b px-6 py-4 flex items-center justify-between rounded-t-2xl ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
                    <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-slate-800'}`}>
                        {modalMode === 'add' ? 'Thêm Tour Mới' : 'Chỉnh Sửa Tour'}
                    </h2>
                    <button onClick={onClose} disabled={isLoading} className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-slate-100'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                            Tên Tour <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={isLoading}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-slate-300'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            placeholder="Nhập tên tour"
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                            Tệp ảnh {modalMode === 'add' ? <span className="text-red-500">*</span> : ''}
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={isLoading}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-slate-300'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                            URL ảnh (tùy chọn)
                        </label>
                        <input
                            type="text"
                            value={formData.imageUrl}
                            onChange={handleImageUrlChange}
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
                            {imagePreview ? (
                                <>
                                    <button onClick={() => openImageModal(imagePreview)} className="focus:outline-none" disabled={isLoading}>
                                        <img
                                            src={imagePreview}
                                            alt="Xem trước"
                                            className={`w-32 h-32 rounded-lg object-cover border ${theme === 'dark' ? 'border-gray-600 hover:opacity-80' : 'border-slate-200 hover:opacity-80'} transition-opacity ${isLoading ? 'opacity-50' : ''}`}
                                            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/128x128?text=URL+Ảnh+Không+Hợp+Lệ'; }}
                                        />
                                    </button>
                                    <button onClick={() => openImageModal(imagePreview)} disabled={isLoading} className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-blue-400 hover:bg-blue-900' : 'text-blue-600 hover:bg-blue-50'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} title="Xem ảnh lớn">
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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                                Điểm Đến <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.destinationName}
                                onChange={(e) => setFormData({ ...formData, destinationName: e.target.value })}
                                disabled={isLoading}
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-slate-300'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                placeholder="Nhập điểm đến"
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                                Thời Gian <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="VD: 3 ngày 2 đêm"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                disabled={isLoading}
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-slate-300'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                                Giá Tour (VNĐ) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                disabled={isLoading}
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-slate-300'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                placeholder="Nhập giá tour"
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                                Số người tối đa <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.maxParticipants}
                                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                                disabled={isLoading}
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-slate-300'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                placeholder="VD: 30"
                            />
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                            Trạng Thái <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                            disabled={isLoading}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-slate-300'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <option value="ACTIVE">Hoạt động</option>
                            <option value="INACTIVE">Tạm dừng</option>
                        </select>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
                            Mô Tả <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            disabled={isLoading}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-slate-300'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            placeholder="Nhập mô tả tour"
                        />
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
                                    {modalMode === 'add' ? 'Đang thêm' : 'Đang cập nhật'}
                                </div>
                            ) : (
                                modalMode === 'add' ? 'Thêm Tour' : 'Cập Nhật'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourFormModal;