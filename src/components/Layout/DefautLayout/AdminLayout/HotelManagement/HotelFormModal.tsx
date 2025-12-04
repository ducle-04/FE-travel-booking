// src/components/Layout/DefautLayout/AdminLayout/HotelManagement/HotelFormModal.tsx

import React, { useState } from 'react';
import { X, Upload, Trash2, Video, Play } from 'lucide-react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { deleteHotelImage, deleteHotelVideo } from '../../../../../services/hotelService';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    modalMode: 'add' | 'edit';
    formData: {
        id?: number;
        name: string;
        address: string;
        starRating: number | '';
        description?: string;
        status: 'ACTIVE' | 'INACTIVE';
        images?: string[];
        videos?: string[];
    };
    setFormData: React.Dispatch<React.SetStateAction<Props['formData']>>;
    imageFiles: File[];
    setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
    videoFiles: File[];
    setVideoFiles: React.Dispatch<React.SetStateAction<File[]>>;
    imagePreviews: string[];
    setImagePreviews: React.Dispatch<React.SetStateAction<string[]>>;
    videoPreviews: string[];
    setVideoPreviews: React.Dispatch<React.SetStateAction<string[]>>;
    onSubmit: () => Promise<void>;
    theme: 'light' | 'dark';
    openImageModal: (url: string) => void;
    openVideoModal?: (url: string) => void;
}

const HotelFormModal: React.FC<Props> = ({
    isOpen,
    onClose,
    modalMode,
    formData,
    setFormData,
    imageFiles,
    setImageFiles,
    setVideoFiles,
    imagePreviews,
    setImagePreviews,
    videoPreviews,
    setVideoPreviews,
    onSubmit,
    theme,
    openImageModal,
    openVideoModal
}) => {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const hotelId = modalMode === 'edit' ? formData.id : null;

    const validateForm = (): string | null => {
        if (!formData.name.trim()) return 'Tên khách sạn không được để trống.';
        if (!formData.address.trim()) return 'Địa chỉ không được để trống.';
        if (formData.starRating === '' || formData.starRating < 1 || formData.starRating > 5)
            return 'Vui lòng chọn số sao hợp lệ (1-5).';
        if (modalMode === 'add' && imageFiles.length === 0 && (!formData.images || formData.images.length === 0)) {
            return 'Vui lòng tải lên ít nhất 1 hình ảnh.';
        }
        return null;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024);
        setImageFiles(prev => [...prev, ...files]);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files).filter(f => f.type.startsWith('video/') && f.size <= 100 * 1024 * 1024);
        setVideoFiles(prev => [...prev, ...files]);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setVideoPreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeNewImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewVideo = (index: number) => {
        setVideoFiles(prev => prev.filter((_, i) => i !== index));
        setVideoPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // XÓA ẢNH CŨ → GỌI API THẬT
    const removeExistingImage = async (url: string) => {
        if (!hotelId) return;

        const result = await Swal.fire({
            title: 'Xóa ảnh này?',
            text: 'Ảnh sẽ bị xóa vĩnh viễn khỏi khách sạn',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            reverseButtons: true,
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
        });

        if (!result.isConfirmed) return;

        try {
            await deleteHotelImage(hotelId, url);
            setFormData(prev => ({
                ...prev,
                images: prev.images?.filter(img => img !== url) || []
            }));
            toast.success('Xóa ảnh thành công!', { theme: theme === 'dark' ? 'dark' : 'light' });
        } catch (err) {
            toast.error('Xóa ảnh thất bại!', { theme: theme === 'dark' ? 'dark' : 'light' });
        }
    };

    // XÓA VIDEO CŨ → GỌI API THẬT
    const removeExistingVideo = async (url: string) => {
        if (!hotelId) return;

        const result = await Swal.fire({
            title: 'Xóa video này?',
            text: 'Video sẽ bị xóa vĩnh viễn',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            reverseButtons: true,
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
        });

        if (!result.isConfirmed) return;

        try {
            await deleteHotelVideo(hotelId, url);
            setFormData(prev => ({
                ...prev,
                videos: prev.videos?.filter(vid => vid !== url) || []
            }));
            toast.success('Xóa video thành công!', { theme: theme === 'dark' ? 'dark' : 'light' });
        } catch (err) {
            toast.error('Xóa video thất bại!', { theme: theme === 'dark' ? 'dark' : 'light' });
        }
    };

    // Danh sách hiển thị: ảnh mới + ảnh cũ
    const allImages = [...imagePreviews, ...(formData.images || [])];
    const allVideos = [...videoPreviews, ...(formData.videos || [])];

    const handleSubmit = async () => {
        const error = validateForm();
        if (error) {
            toast.error(error, { theme: theme === 'dark' ? 'dark' : 'light' });
            return;
        }

        const result = await Swal.fire({
            title: modalMode === 'add' ? 'Thêm khách sạn mới?' : 'Cập nhật khách sạn?',
            html: `
                <p class="text-lg">Bạn có chắc muốn <strong>${modalMode === 'add' ? 'thêm mới' : 'cập nhật'}</strong> khách sạn:</p>
                <p class="text-2xl font-bold text-blue-600 mt-3">"${formData.name}"</p>
                <p class="text-sm text-gray-500 mt-2">${formData.address}</p>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: modalMode === 'add' ? 'Thêm ngay' : 'Cập nhật',
            cancelButtonText: 'Hủy',
            reverseButtons: true,
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
        });

        if (!result.isConfirmed) return;

        setIsLoading(true);
        try {
            await onSubmit();
            toast.success(`${modalMode === 'add' ? 'Thêm' : 'Cập nhật'} khách sạn thành công!`, {
                theme: theme === 'dark' ? 'dark' : 'light',
            });
            onClose();
        } catch (err: any) {
            toast.error(err.message || `Không thể ${modalMode === 'add' ? 'thêm' : 'cập nhật'} khách sạn.`, {
                theme: theme === 'dark' ? 'dark' : 'light',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-black/80' : 'bg-black/60'} backdrop-blur-sm`}>
            <div className={`w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl ${theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>

                {/* Loading Overlay */}
                {isLoading && (
                    <div className={`absolute inset-0 z-50 flex items-center justify-center rounded-3xl ${theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'}`}>
                        <div className="flex flex-col items-center gap-4">
                            <div className={`h-12 w-12 animate-spin rounded-full border-4 border-t-transparent ${theme === 'dark' ? 'border-blue-400' : 'border-blue-600'}`} />
                            <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Đang xử lý...</p>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-300 dark:border-gray-700 p-6 bg-inherit">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {modalMode === 'add' ? 'Thêm khách sạn mới' : 'Chỉnh sửa khách sạn'}
                    </h2>
                    <button onClick={onClose} disabled={isLoading} className={`p-2.5 rounded-xl transition ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                        <X size={26} className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                <div className="p-6 space-y-8">

                    {/* Tên + Địa chỉ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                Tên khách sạn <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                disabled={isLoading}
                                placeholder="VD: Vinpearl Resort Nha Trang"
                                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 transition ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'}`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                Địa chỉ đầy đủ <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                disabled={isLoading}
                                placeholder="VD: 123 Trần Phú, Nha Trang, Khánh Hòa"
                                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 transition ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'}`}
                            />
                        </div>
                    </div>

                    {/* Số sao + Trạng thái */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                Số sao <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.starRating}
                                onChange={e => setFormData(prev => ({ ...prev, starRating: e.target.value === '' ? '' : Number(e.target.value) }))}
                                disabled={isLoading}
                                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 transition ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                            >
                                <option value="">Chọn số sao</option>
                                {[5, 4, 3, 2, 1].map(s => (
                                    <option key={s} value={s}>{s} sao</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Trạng thái</label>
                            <select
                                value={formData.status}
                                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as 'ACTIVE' | 'INACTIVE' }))}
                                disabled={isLoading}
                                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 transition ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                            >
                                <option value="ACTIVE">Đang hoạt động</option>
                                <option value="INACTIVE">Tạm dừng</option>
                            </select>
                        </div>
                    </div>

                    {/* Mô tả */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Mô tả khách sạn</label>
                        <textarea
                            rows={4}
                            value={formData.description || ''}
                            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            disabled={isLoading}
                            placeholder="Giới thiệu về khách sạn, tiện ích, vị trí nổi bật..."
                            className={`w-full px-4 py-3 rounded-xl border resize-none focus:ring-2 focus:ring-blue-500 transition ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'}`}
                        />
                    </div>

                    {/* Upload Ảnh */}
                    <div>
                        <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                            Hình ảnh khách sạn {modalMode === 'add' && <span className="text-red-500">*</span>}
                        </label>
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="hotel-images" />
                        <label htmlFor="hotel-images" className={`block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'}`}>
                            <Upload size={36} className="mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                            <p className="font-medium text-gray-700 dark:text-gray-300">Nhấn để tải lên hoặc kéo thả ảnh</p>
                            <p className="text-xs text-gray-500 mt-1">JPG, PNG, tối đa 10MB mỗi ảnh</p>
                        </label>

                        {allImages.length > 0 && (
                            <div className="mt-6 grid grid-cols-3 md:grid-cols-6 gap-4">
                                {allImages.map((url, index) => {
                                    const isNew = index < imagePreviews.length;
                                    return (
                                        <div key={index} className="relative group">
                                            <img
                                                src={url}
                                                alt={`Ảnh ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-xl shadow-md cursor-pointer hover:brightness-90 transition"
                                                onClick={() => openImageModal(url)}
                                                onError={e => e.currentTarget.src = 'https://via.placeholder.com/128?text=HOTEL'}
                                            />
                                            <button
                                                onClick={() => isNew ? removeNewImage(index) : removeExistingImage(url)}
                                                disabled={isLoading}
                                                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Upload Video */}
                    <div>
                        <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                            Video giới thiệu khách sạn
                        </label>

                        <input type="file" accept="video/*" onChange={handleVideoChange} className="hidden" id="hotel-videos" />
                        <label htmlFor="hotel-videos" className={`block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'}`}>
                            <Video size={36} className="mx-auto mb-3 text-purple-600 dark:text-purple-400" />
                            <p className="font-medium text-gray-700 dark:text-gray-300">Nhấn để tải video lên</p>
                            <p className="text-xs text-gray-500 mt-1">MP4, MOV, tối đa 100MB</p>
                        </label>

                        {allVideos.length > 0 && (
                            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                {allVideos.map((url, index) => {
                                    const isNew = index < videoPreviews.length;
                                    return (
                                        <div key={index} className="relative group">
                                            <video
                                                src={url}
                                                className="w-full h-40 object-cover rounded-xl shadow-md"
                                                controls
                                                preload="metadata"
                                            />

                                            <button
                                                onClick={() => isNew ? removeNewVideo(index) : removeExistingVideo(url)}
                                                disabled={isLoading}
                                                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-50 hover:scale-110"
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                            {openVideoModal && (
                                                <button
                                                    onClick={() => openVideoModal(url)}
                                                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-xl z-40"
                                                >
                                                    <Play size={56} className="text-white drop-shadow-2xl" fill="white" />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 p-6 border-t border-gray-300 dark:border-gray-700 bg-inherit flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className={`px-8 py-3.5 rounded-xl font-medium transition ${isLoading ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed' : 'border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !formData.name.trim() || !formData.address.trim() || formData.starRating === ''}
                        className={`px-8 py-3.5 rounded-xl font-medium text-white flex items-center gap-3 transition ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transform hover:scale-105'}`}
                    >
                        {isLoading ? (
                            <>
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-white" />
                                Đang xử lý...
                            </>
                        ) : (
                            modalMode === 'add' ? 'Thêm khách sạn' : 'Lưu thay đổi'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HotelFormModal;