import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import TourTable from '../../components/Layout/DefautLayout/AdminLayout/TourManagement/TourTable';
import TourFormModal from '../../components/Layout/DefautLayout/AdminLayout/TourManagement/TourFormModal';
import ImagePreviewModal from '../../components/Layout/DefautLayout/AdminLayout/DestinationManagement/ImagePreviewModal';
import Pagination from '../../components/Layout/DefautLayout/AdminLayout/UserManagement/Pagination';
import TourStats from '../../components/Layout/DefautLayout/AdminLayout/TourManagement/TourStats';
import {
    fetchDestinations,
    fetchTours,
    fetchTourCategories,
    addTour,
    updateTour,
    deleteTour,
    type TourCategory,
    type Tour,
} from '../../services/tourService';

interface Destination {
    id: number;
    name: string;
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
    startDates: string[];
}

const TourManagement: React.FC = () => {
    const { theme } = useTheme();

    const [tours, setTours] = useState<Tour[]>([]);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [tourCategories, setTourCategories] = useState<TourCategory[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedDestination, setSelectedDestination] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all'); // ← Lọc loại tour
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [showImageModal, setShowImageModal] = useState<boolean>(false);
    const [imageModalUrl, setImageModalUrl] = useState<string | null>(null);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        imageUrl: '',
        destinationName: '',
        duration: '',
        price: '',
        description: '',
        status: 'ACTIVE',
        maxParticipants: '50',
        categoryId: '',
        startDates: [],
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const getToken = () => localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken') || '';

    // Load danh sách điểm đến & loại tour
    useEffect(() => {
        fetchDestinationsData();
        fetchTourCategoriesData();
    }, []);

    // Load tour khi thay đổi bộ lọc hoặc trang
    useEffect(() => {
        fetchToursData();
    }, [currentPage, searchTerm, selectedDestination, selectedStatus, selectedCategory, minPrice, maxPrice]);

    // Reset trang khi tìm kiếm hoặc đổi loại tour
    useEffect(() => {
        setCurrentPage(0);
    }, [searchTerm, selectedCategory]);

    const fetchDestinationsData = async () => {
        try {
            const data = await fetchDestinations();
            setDestinations(data);
        } catch (err) {
            console.error('Lỗi tải điểm đến');
        }
    };

    const fetchTourCategoriesData = async () => {
        try {
            const cats = await fetchTourCategories();
            setTourCategories(cats);
        } catch (err) {
            console.warn('Không tải được loại tour');
        }
    };

    const fetchToursData = async () => {
        setLoading(true);
        try {
            const { tours, totalPages, totalItems } = await fetchTours(
                currentPage,
                searchTerm || undefined,
                selectedDestination === 'all' ? undefined : selectedDestination,
                selectedStatus === 'all' ? undefined : selectedStatus,
                minPrice || undefined,
                maxPrice || undefined,
                selectedCategory === 'all' ? undefined : selectedCategory
            );
            setTours(tours);
            setTotalPages(totalPages);
            setTotalItems(totalItems);
        } catch (err) {
            console.error('Lỗi tải tour');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setCurrentPage(0);
        fetchToursData();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            imageUrl: '',
            destinationName: '',
            duration: '',
            price: '',
            description: '',
            status: 'ACTIVE',
            maxParticipants: '50',
            categoryId: '',
            startDates: [],
        });
        setImageFile(null);
        setImagePreview(null);
    };

    const openModal = (mode: 'add' | 'edit', tour?: Tour) => {
        setModalMode(mode);
        if (mode === 'edit' && tour) {
            setSelectedTour(tour);
            setFormData({
                name: tour.name,
                imageUrl: tour.imageUrl,
                destinationName: tour.destinationName,
                duration: tour.duration,
                price: tour.price.toString(),
                description: tour.description,
                status: tour.status,
                maxParticipants: tour.maxParticipants.toString(),
                categoryId: tour.categoryId?.toString() || '',
                startDates: tour.startDates || [],
            });
            setImagePreview(tour.imageUrl);
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        setLoading(true);
        try {
            const token = getToken();
            await deleteTour(token, id);
            fetchToursData();
        } catch (err: any) {
            alert(err.message || 'Xóa thất bại');
        } finally {
            setLoading(false);
        }
    };

    const openImageModal = (url: string) => {
        setImageModalUrl(url);
        setShowImageModal(true);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page - 1);
        }
    };

    const handleSubmit = async () => {
        const token = getToken();
        if (!token) throw new Error('Phiên đăng nhập đã hết hạn');

        const selectedCat = tourCategories.find(cat => cat.id === Number(formData.categoryId));
        if (formData.categoryId && !selectedCat) throw new Error('Loại tour không hợp lệ');

        const tourData = new FormData();
        const parsedData = {
            ...formData,
            price: parseFloat(formData.price) || 0,
            maxParticipants: parseInt(formData.maxParticipants) || 50,
            categoryName: selectedCat?.name || null,
            startDates: formData.startDates.filter(date => date.trim() !== ''),
        };

        const { categoryId, ...dataToSend } = parsedData;
        tourData.append('tour', JSON.stringify(dataToSend));
        if (imageFile) tourData.append('image', imageFile);

        setLoading(true);
        try {
            if (modalMode === 'add') {
                await addTour(token, tourData);
            } else if (selectedTour) {
                await updateTour(token, selectedTour.id, tourData);
            }
            fetchToursData();
            setShowModal(false);
            resetForm();
        } catch (error: any) {
            alert(error.message || 'Lưu tour thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-700' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
            <div className="max-w-7xl mx-auto">
                {/* Header + Bộ lọc nâng cao */}
                <div className={`rounded-2xl p-6 mb-6 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-slate-200'}`}>
                    <h1 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                        Quản Lý Tour Du Lịch
                    </h1>

                    <div className="space-y-5">

                        {/* Tìm kiếm + Thêm tour */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm tour..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'}`}
                                />
                            </div>
                            <button onClick={handleSearch} className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium">
                                Tìm kiếm
                            </button>
                            <button onClick={() => openModal('add')} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium">
                                <Plus size={20} /> Thêm Tour Mới
                            </button>
                        </div>

                        {/* Bộ lọc nâng cao */}
                        <div className="space-y-4">
                            {/* Hàng 1: Các bộ lọc cơ bản */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Điểm đến */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Điểm đến
                                    </label>
                                    <select
                                        value={selectedDestination}
                                        onChange={(e) => { setSelectedDestination(e.target.value); setCurrentPage(0); }}
                                        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'}`}
                                    >
                                        <option value="all">Tất cả điểm đến</option>
                                        {destinations.map(d => (
                                            <option key={d.id} value={d.name}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Loại tour */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Loại tour
                                    </label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(0); }}
                                        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'}`}
                                    >
                                        <option value="all">Tất cả loại tour</option>
                                        {tourCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Trạng thái */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Trạng thái
                                    </label>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(0); }}
                                        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'}`}
                                    >
                                        <option value="all">Tất cả trạng thái</option>
                                        <option value="ACTIVE">Đang hoạt động</option>
                                        <option value="INACTIVE">Tạm dừng</option>
                                    </select>
                                </div>
                            </div>

                            {/* Hàng 2: Lọc giá */}
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                                <label className={`block text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Khoảng giá (VNĐ)
                                </label>

                                {/* Khoảng giá nhanh */}
                                <div className="mb-4">
                                    <p className={`text-xs font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Khoảng giá nhanh
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {[
                                            { label: 'Dưới 2 triệu', min: '', max: '2000000' },
                                            { label: '2 - 5 triệu', min: '2000000', max: '5000000' },
                                            { label: '5 - 10 triệu', min: '5000000', max: '10000000' },
                                            { label: 'Trên 10 triệu', min: '10000000', max: '' },
                                        ].map((preset) => (
                                            <button
                                                key={preset.label}
                                                onClick={() => {
                                                    setMinPrice(preset.min);
                                                    setMaxPrice(preset.max);
                                                    setCurrentPage(0);
                                                }}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${minPrice === preset.min && maxPrice === preset.max
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                                    : theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 hover:border-gray-500 text-gray-200'
                                                        : 'bg-white border-gray-300 hover:border-gray-400 text-gray-700'
                                                    }`}
                                            >
                                                {preset.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Đường phân cách */}
                                <div className={`border-t my-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}></div>

                                {/* Khoảng giá tùy chỉnh */}
                                <div>
                                    <p className={`text-xs font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Khoảng giá tùy chỉnh
                                    </p>
                                    <div className="flex gap-3 items-center">
                                        <input
                                            type="number"
                                            placeholder="Từ"
                                            value={minPrice}
                                            onChange={(e) => { setMinPrice(e.target.value); setCurrentPage(0); }}
                                            className={`flex-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'}`}
                                        />
                                        <span className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>→</span>
                                        <input
                                            type="number"
                                            placeholder="Đến"
                                            value={maxPrice}
                                            onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(0); }}
                                            className={`flex-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'}`}
                                        />
                                        {(minPrice || maxPrice) && (
                                            <button
                                                onClick={() => { setMinPrice(''); setMaxPrice(''); setCurrentPage(0); }}
                                                className="px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:text-white hover:bg-red-500 transition-all border-2 border-red-500"
                                            >
                                                Xóa
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <TourStats theme={theme} />
                    </div>
                </div>

                {/* Bảng tour */}
                <TourTable
                    tours={tours}
                    theme={theme}
                    onEdit={(tour) => openModal('edit', tour)}
                    onDelete={handleDelete}
                    formatCurrency={formatCurrency}
                    loading={loading}
                />

                {/* Phân trang */}
                <div className="mt-6 flex justify-center">
                    <Pagination
                        currentPage={currentPage + 1}
                        totalPages={totalPages}
                        setCurrentPage={handlePageChange}
                        loading={loading}
                        filteredUsersLength={totalItems}
                    />
                </div>
            </div>

            {/* Modal thêm/sửa */}
            <TourFormModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                modalMode={modalMode}
                formData={formData}
                setFormData={setFormData}
                imageFile={imageFile}
                setImageFile={setImageFile}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                selectedTour={selectedTour}
                onSubmit={handleSubmit}
                theme={theme}
                openImageModal={openImageModal}
                destinations={destinations}
                categories={tourCategories}
            />

            <ImagePreviewModal isOpen={showImageModal} imageUrl={imageModalUrl} onClose={() => setShowImageModal(false)} />
        </div>
    );
};

export default TourManagement;