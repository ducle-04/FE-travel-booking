import React from 'react';
import { X, ImageIcon, ZoomIn } from 'lucide-react';
import { useTheme } from '../../../../../context/ThemeContext';

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
    onSubmit: () => void;
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

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 flex items-center justify-center p-4 z-50 ${theme === 'dark' ? 'bg-black bg-opacity-75' : 'bg-black bg-opacity-50'}`}>
            <div className={`rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
                <div className={`sticky top-0 border-b px-6 py-4 flex items-center justify-between rounded-t-2xl ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
                    <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-slate-800'}`}>
                        {editingDestination ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến mới'}
                    </h2>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-slate-100'}`}
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
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-slate-300'}`}
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
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-slate-300'}`}
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
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-slate-300'}`}
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
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-slate-300'}`}
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
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-slate-300'}`}
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
                                        >
                                            <img
                                                src={formData.imagePreview}
                                                alt="Preview"
                                                className={`w-32 h-32 rounded-lg object-cover border ${theme === 'dark' ? 'border-gray-600 hover:opacity-80' : 'border-slate-200 hover:opacity-80'} transition-opacity`}
                                            />
                                        </button>
                                        <button
                                            onClick={() => onOpenImageModal(formData.imagePreview!)}
                                            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-blue-400 hover:bg-blue-900' : 'text-blue-600 hover:bg-blue-50'}`}
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
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-slate-300'}`}
                                placeholder="Nhập mô tả về điểm đến"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className={`flex-1 px-6 py-3 border rounded-xl font-medium transition-all ${theme === 'dark' ? 'text-gray-200 border-gray-600 hover:bg-gray-700' : 'text-slate-700 border-slate-300 hover:bg-slate-50'}`}
                        >
                            Hủy
                        </button>
                        <button
                            onClick={onSubmit}
                            className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all ${theme === 'dark' ? 'bg-gradient-to-r from-blue-700 to-blue-800 text-white hover:from-blue-800 hover:to-blue-900' : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'}`}
                        >
                            {editingDestination ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DestinationModal;