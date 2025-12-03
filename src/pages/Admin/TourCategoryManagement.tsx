// src/pages/Admin/TourCategoryManagement.tsx
// ĐÃ BỎ HẾT ĐỔ BÓNG + HIỆU ỨNG NỔI THEO YÊU CẦU

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Pagination from '../../components/Layout/DefautLayout/AdminLayout/UserManagement/Pagination';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

interface TourCategory {
    id: number;
    name: string;
    description: string | null;
    icon: string;
    displayOrder: number;
    status: 'ACTIVE' | 'INACTIVE';
}

const validIconMap: Record<string, any> = {
    Waves: LucideIcons.Waves,
    Trees: LucideIcons.Trees,
    Landmark: LucideIcons.Landmark,
    Utensils: LucideIcons.UtensilsCrossed,
    Briefcase: LucideIcons.Briefcase,
    Mountain: LucideIcons.Mountain,
    Palms: LucideIcons.Palmtree,
    Church: LucideIcons.Church,
    Castle: LucideIcons.Castle,
    Ship: LucideIcons.Ship,
    Camera: LucideIcons.Camera,
    Heart: LucideIcons.Heart,
    Star: LucideIcons.Star,
    Sun: LucideIcons.Sun,
    Moon: LucideIcons.Moon,
    MapPin: LucideIcons.MapPin,
};

const iconOptions = Object.keys(validIconMap);

const DynamicIcon = ({ name }: { name: string }) => {
    const Icon = validIconMap[name] || LucideIcons.MapPin;
    return <Icon size={36} className="text-blue-500" />;
};

const TourCategoryManagement: React.FC = () => {
    const { theme } = useTheme();
    const [categories, setCategories] = useState<TourCategory[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        icon: 'MapPin',
        displayOrder: 0,
        status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
    });

    const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken') || '';

    const fetchCategories = async (page = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/api/tour-categories?page=${page - 1}&size=12`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const json = await res.json();
            if (json.data?.content) {
                setCategories(json.data.content);
                setTotalPages(json.data.totalPages || 1);
            }
        } catch {
            toast.error('Lỗi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories(currentPage);
    }, [currentPage]);

    // Chỉ hiển thị ACTIVE + tìm kiếm
    const filtered = categories
        .filter(c => c.status === 'ACTIVE')
        .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const openModal = (mode: 'add' | 'edit', cat?: TourCategory) => {
        setIsEdit(mode === 'edit');
        if (mode === 'edit' && cat) {
            setFormData({
                name: cat.name,
                description: cat.description || '',
                icon: cat.icon,
                displayOrder: cat.displayOrder,
                status: cat.status
            });
        } else {
            setFormData({
                name: '',
                description: '',
                icon: 'MapPin',
                displayOrder: categories.length + 1,
                status: 'ACTIVE'
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) return toast.error('Tên không được để trống');

        const url = isEdit
            ? `http://localhost:8080/api/tour-categories/${categories.find(c => c.name === formData.name && c.id)?.id || ''}`
            : 'http://localhost:8080/api/tour-categories';

        try {
            const res = await fetch(url, {
                method: isEdit ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    description: formData.description || null,
                    icon: formData.icon,
                    displayOrder: formData.displayOrder,
                    status: formData.status
                })
            });

            if (res.ok) {
                toast.success(isEdit ? 'Cập nhật thành công!' : 'Thêm thành công!');
                setShowModal(false);
                fetchCategories(currentPage);
            } else {
                const err = await res.json();
                toast.error(err.message || 'Lỗi hệ thống');
            }
        } catch {
            toast.error('Lỗi kết nối');
        }
    };

    const handleDelete = async (id: number) => {
        const confirm = await Swal.fire({
            title: 'Ẩn loại tour?',
            text: 'Sẽ chuyển sang trạng thái INACTIVE',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ẩn',
            cancelButtonText: 'Hủy',
        });
        if (!confirm.isConfirmed) return;

        await fetch(`http://localhost:8080/api/tour-categories/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Đã ẩn!');
        fetchCategories(currentPage);
    };

    return (
        <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-700' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
            <div className="max-w-7xl mx-auto">
                <div className={`rounded-2xl p-8 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">Quản Lý Loại Tour</h1>
                        <button
                            onClick={() => openModal('add')}
                            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold transition"
                        >
                            <Plus size={22} /> Thêm Loại Mới
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm loại tour..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className={`w-full pl-12 pr-6 py-4 rounded-xl text-lg border-2 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-300'
                                }`}
                        />
                    </div>

                    {/* Grid – KHÔNG CÒN ĐỔ BÓNG */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {loading ? (
                            Array(12).fill(0).map((_, i) => (
                                <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl h-64"></div>
                            ))
                        ) : filtered.length === 0 ? (
                            <p className="col-span-full text-center py-20 text-2xl text-gray-500">
                                {searchTerm ? 'Không tìm thấy' : 'Chưa có loại tour nào'}
                            </p>
                        ) : (
                            filtered.map(cat => (
                                <div
                                    key={cat.id}
                                    className={`rounded-2xl p-8 border-2 ${cat.status === 'INACTIVE' ? 'opacity-60 border-dashed border-red-500/50' : theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                                        }`}
                                >
                                    <div className="flex flex-col items-center text-center space-y-5">
                                        <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
                                            <DynamicIcon name={cat.icon} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{cat.name}</h3>
                                            {cat.description && (
                                                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{cat.description}</p>
                                            )}
                                        </div>
                                        {cat.status === 'INACTIVE' && (
                                            <span className="px-4 py-1 text-xs font-bold bg-red-900/40 text-red-300 rounded-full">
                                                Đã ẩn
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <button
                                            onClick={() => openModal('edit', cat)}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                                        >
                                            <Edit size={18} /> Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition"
                                        >
                                            <Trash2 size={18} /> Ẩn
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {!searchTerm && totalPages > 1 && (
                        <div className="mt-12 flex justify-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                setCurrentPage={setCurrentPage}
                                loading={loading}
                                filteredUsersLength={filtered.length}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Modal – cũng bỏ hết shadow */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
                    <div className={`w-full max-w-2xl rounded-3xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} max-h-[90vh] overflow-y-auto`}>
                        <div className={`flex items-center justify-between border-b px-8 py-5 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h2 className="text-3xl font-bold">{isEdit ? 'Sửa Loại Tour' : 'Thêm Loại Tour'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition">
                                <X size={28} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div>
                                <label className="block mb-3 text-lg font-medium">Tên loại tour *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full px-5 py-4 rounded-xl border-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'}`}
                                />
                            </div>

                            <div>
                                <label className="block mb-3 text-lg font-medium">Mô tả</label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className={`w-full px-5 py-4 rounded-xl border-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'}`}
                                />
                            </div>

                            <div>
                                <label className="block mb-3 text-lg font-medium">Thứ tự hiển thị</label>
                                <input
                                    type="number"
                                    value={formData.displayOrder}
                                    onChange={e => setFormData({ ...formData, displayOrder: +e.target.value || 0 })}
                                    className={`w-full px-5 py-4 rounded-xl border-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'}`}
                                />
                            </div>

                            <div>
                                <label className="block mb-3 text-lg font-medium">Chọn Icon</label>
                                <div className="grid grid-cols-6 sm:grid-cols-8 gap-4">
                                    {iconOptions.map(name => (
                                        <button
                                            key={name}
                                            onClick={() => setFormData({ ...formData, icon: name })}
                                            className={`p-5 rounded-2xl border-4 transition-all ${formData.icon === name
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/40'
                                                    : theme === 'dark'
                                                        ? 'border-gray-600 hover:border-gray-500'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            <DynamicIcon name={name} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className={`flex-1 py-4 rounded-xl text-lg font-medium border-2 transition ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-bold flex items-center justify-center gap-3 transition"
                                >
                                    <Save size={22} /> {isEdit ? 'Lưu Thay Đổi' : 'Thêm Mới'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TourCategoryManagement;