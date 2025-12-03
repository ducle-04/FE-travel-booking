import React, { useState } from 'react';
import { X, ImageIcon, ZoomIn } from 'lucide-react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Destination {
    id: number;
    name: string;
}

interface TourCategory {
    id: number;
    name: string;
    icon: string;
}

interface FormData {
    name: string;
    imageUrl: string;
    destinationName: string;
    duration: string;
    price: string;
    description: string;
    status: 'ACTIVE' | 'INACTIVE';
    maxParticipants: string;
    categoryId: string;
    startDates: string[]; // ← Nhiều ngày khởi hành
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
    selectedTour: any;
    onSubmit: () => Promise<void>;
    theme: string;
    openImageModal: (imageUrl: string) => void;
    destinations: Destination[];
    categories: TourCategory[];
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
    destinations,
    categories,
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = (): string | null => {
        if (!formData.name.trim()) return 'Tên tour không được để trống.';
        if (!formData.destinationName) return 'Vui lòng chọn điểm đến.';
        if (!formData.duration.trim()) return 'Thời gian không được để trống.';
        if (!formData.categoryId) return 'Vui lòng chọn loại tour.';
        if (!formData.price || Number(formData.price) <= 0) return 'Giá tour phải lớn hơn 0.';
        if (!formData.maxParticipants || Number(formData.maxParticipants) <= 0) return 'Số người tối đa phải lớn hơn 0.';
        if (!formData.description.trim()) return 'Mô tả không được để trống.';
        if (formData.startDates.filter(d => d.trim() !== '').length === 0) return 'Phải có ít nhất 1 ngày khởi hành.';
        if (modalMode === 'add' && !imageFile && !formData.imageUrl.trim()) return 'Vui lòng tải lên ảnh hoặc nhập URL ảnh.';
        return null;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setFormData(prev => ({ ...prev, imageUrl: '' }));
        } else {
            setImagePreview(formData.imageUrl || null);
        }
    };

    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value.trim();
        setFormData(prev => ({ ...prev, imageUrl: url }));
        setImageFile(null);
        setImagePreview(url || null);
    };

    const handleSubmit = async () => {
        const error = validateForm();
        if (error) {
            toast.error(error, { theme: theme === 'dark' ? 'dark' : 'light' });
            return;
        }

        const result = await Swal.fire({
            title: `Xác nhận ${modalMode === 'add' ? 'thêm' : 'cập nhật'} tour`,
            text: `Bạn có chắc muốn ${modalMode === 'add' ? 'thêm' : 'cập nhật'} tour "${formData.name}" không?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
            reverseButtons: true,
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
        });

        if (!result.isConfirmed) return;

        setIsLoading(true);
        try {
            await onSubmit();
            toast.success(`${modalMode === 'add' ? 'Thêm' : 'Cập nhật'} tour thành công!`, {
                theme: theme === 'dark' ? 'dark' : 'light',
            });
            onClose();
        } catch (err: any) {
            toast.error(err.message || `Không thể ${modalMode === 'add' ? 'thêm' : 'cập nhật'} tour`, {
                theme: theme === 'dark' ? 'dark' : 'light',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-black/75' : 'bg-black/50'}`}>
            <div className={`w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                {/* Loading overlay */}
                {isLoading && (
                    <div className={`absolute inset-0 z-20 flex items-center justify-center rounded-2xl ${theme === 'dark' ? 'bg-gray-900/90' : 'bg-white/90'}`}>
                        <div className="flex flex-col items-center gap-3">
                            <div className={`h-10 w-10 animate-spin rounded-full border-4 border-t-transparent ${theme === 'dark' ? 'border-blue-400' : 'border-blue-600'}`} />
                            <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                Đang xử lý...
                            </p>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className={`sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {modalMode === 'add' ? 'Thêm Tour Mới' : 'Chỉnh Sửa Tour'}
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className={`rounded-lg p-2 transition ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Tên tour */}
                    <div>
                        <label className={`mb-2 block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                            Tên Tour <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            disabled={isLoading}
                            placeholder="Nhập tên tour"
                            className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                        />
                    </div>

                    {/* Ảnh */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className={`mb-2 block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                Tải lên ảnh {modalMode === 'add' && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={isLoading}
                                className={`w-full rounded-xl border px-4 py-3 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`}
                            />
                        </div>
                        <div>
                            <label className={`mb-2 block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                Hoặc nhập URL ảnh
                            </label>
                            <input
                                type="url"
                                value={formData.imageUrl}
                                onChange={handleImageUrlChange}
                                disabled={isLoading}
                                placeholder="https://example.com/image.jpg"
                                className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                            />
                        </div>
                    </div>

                    {/* Preview ảnh */}
                    <div>
                        <label className={`mb-2 block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Xem trước</label>
                        <div className="flex items-center gap-3">
                            {imagePreview ? (
                                <>
                                    <button onClick={() => openImageModal(imagePreview)} disabled={isLoading}>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-32 w-32 rounded-lg border object-cover shadow-md transition hover:opacity-90"
                                            onError={e => (e.currentTarget.src = 'https://via.placeholder.com/128?text=No+Image')}
                                        />
                                    </button>
                                    <button
                                        onClick={() => openImageModal(imagePreview)}
                                        className={`rounded-lg p-2 ${theme === 'dark' ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-blue-50'}`}
                                        title="Phóng to"
                                        disabled={isLoading}
                                    >
                                        <ZoomIn size={20} />
                                    </button>
                                </>
                            ) : (
                                <div className={`flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
                                    <ImageIcon className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} size={36} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Điểm đến + Loại tour */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className={`mb-2 block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                Điểm Đến <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.destinationName}
                                onChange={e => setFormData(prev => ({ ...prev, destinationName: e.target.value }))}
                                disabled={isLoading}
                                className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                            >
                                <option value="">-- Chọn điểm đến --</option>
                                {destinations.map(dest => (
                                    <option key={dest.id} value={dest.name}>
                                        {dest.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={`mb-2 block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                Loại Tour <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.categoryId}
                                onChange={e => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                                disabled={isLoading}
                                className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                            >
                                <option value="">-- Chọn loại tour --</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Thời gian + Giá */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className={`mb-2 block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                Thời Gian <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="VD: 3 ngày 2 đêm"
                                value={formData.duration}
                                onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                                disabled={isLoading}
                                className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                            />
                        </div>

                        <div>
                            <label className={`mb-2 block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                Giá Tour (VNĐ) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.price}
                                onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                disabled={isLoading}
                                placeholder="1,500,000"
                                className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                            />
                        </div>
                    </div>

                    {/* Số người tối đa + Trạng thái */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className={`mb-2 block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                Số người tối đa <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.maxParticipants}
                                onChange={e => setFormData(prev => ({ ...prev, maxParticipants: e.target.value }))}
                                disabled={isLoading}
                                placeholder="30"
                                className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                            />
                        </div>

                        <div>
                            <label className={`mb-2 block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                Trạng Thái
                            </label>
                            <select
                                value={formData.status}
                                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as 'ACTIVE' | 'INACTIVE' }))}
                                disabled={isLoading}
                                className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                            >
                                <option value="ACTIVE">Hoạt động</option>
                                <option value="INACTIVE">Tạm dừng</option>
                            </select>
                        </div>
                    </div>

                    {/* Mô tả */}
                    <div>
                        <label className={`mb-2 block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                            Mô Tả Tour <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={5}
                            value={formData.description}
                            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            disabled={isLoading}
                            placeholder="Mô tả chi tiết về tour..."
                            className={`w-full resize-none rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                        />
                    </div>

                    {/* NGÀY KHỞI HÀNH – TÍNH NĂNG MỚI */}
                    <div>
                        <label className={`mb-2 block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                            Ngày Khởi Hành <span className="text-red-500">*</span>
                            <span className="ml-2 text-xs text-gray-500">(Có thể chọn nhiều ngày)</span>
                        </label>
                        <div className="space-y-3">
                            {formData.startDates.map((date, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => {
                                            const newDates = [...formData.startDates];
                                            newDates[index] = e.target.value;
                                            setFormData(prev => ({ ...prev, startDates: newDates }));
                                        }}
                                        disabled={isLoading}
                                        className={`flex-1 rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                                                ? 'border-gray-600 bg-gray-700 text-gray-100'
                                                : 'border-gray-300 bg-white text-gray-900'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newDates = formData.startDates.filter((_, i) => i !== index);
                                            setFormData(prev => ({ ...prev, startDates: newDates }));
                                        }}
                                        disabled={isLoading}
                                        className="rounded-lg bg-red-600 px-4 py-3 text-white hover:bg-red-700 disabled:opacity-50 transition"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => {
                                    setFormData(prev => ({ ...prev, startDates: [...prev.startDates, ''] }));
                                }}
                                disabled={isLoading}
                                className={`w-full rounded-xl border-2 border-dashed px-4 py-3 font-medium transition ${theme === 'dark'
                                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                + Thêm ngày khởi hành
                            </button>
                        </div>

                        {/* Hiển thị số ngày đã chọn */}
                        {formData.startDates.filter(d => d.trim() !== '').length > 0 && (
                            <div className="mt-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                    Đã chọn {formData.startDates.filter(d => d.trim() !== '').length} ngày khởi hành:
                                </p>
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {formData.startDates
                                        .filter(d => d.trim() !== '')
                                        .map((date, i) => (
                                            <span
                                                key={i}
                                                className="inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white"
                                            >
                                                {new Date(date).toLocaleDateString('vi-VN')}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className={`flex-1 rounded-xl border px-6 py-3 font-medium transition ${theme === 'dark' ? 'border-gray-600 text-gray-200 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} ${isLoading ? 'cursor-not-allowed opacity-60' : ''}`}
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className={`flex-1 rounded-xl px-6 py-3 font-medium text-white transition ${theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'} ${isLoading ? 'cursor-not-allowed opacity-80' : ''}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-white" />
                                    Đang xử lý...
                                </span>
                            ) : modalMode === 'add' ? (
                                'Thêm Tour'
                            ) : (
                                'Cập Nhật Tour'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourFormModal;