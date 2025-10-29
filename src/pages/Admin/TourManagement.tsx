import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import TourTable from '../../components/Layout/DefautLayout/AdminLayout/TourManagement/TourTable';
import TourFormModal from '../../components/Layout/DefautLayout/AdminLayout/TourManagement/TourFormModal';
import ImagePreviewModal from '../../components/Layout/DefautLayout/AdminLayout/DestinationManagement/ImagePreviewModal';
import Pagination from '../../components/Layout/DefautLayout/AdminLayout/UserManagement/Pagination';
import TourStats from '../../components/Layout/DefautLayout/AdminLayout/TourManagement/TourStats';
import { fetchDestinations, fetchTours, addTour, updateTour, deleteTour } from '../../services/tourService';

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
}

const TourManagement: React.FC = () => {
    const { theme } = useTheme();
    const [tours, setTours] = useState<Tour[]>([]);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedDestination, setSelectedDestination] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
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
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const getToken = () => localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken') || '';

    useEffect(() => {
        fetchDestinationsData();
        fetchToursData();
    }, [currentPage, selectedDestination, selectedStatus, minPrice, maxPrice]);

    useEffect(() => {
        if (totalItems <= 10 && currentPage !== 0) {
            setCurrentPage(0);
        }
    }, [totalItems, currentPage]);

    const fetchDestinationsData = async () => {
        try {
            const data = await fetchDestinations();
            setDestinations(data);
        } catch (error: any) {
            console.error('Lỗi khi tải danh sách điểm đến:', error.message);
        }
    };

    const fetchToursData = async () => {
        setLoading(true);
        try {
            const { tours, totalPages, totalItems } = await fetchTours(
                currentPage,
                searchTerm,
                selectedDestination,
                selectedStatus,
                minPrice,
                maxPrice
            );
            setTours(tours);
            setTotalPages(totalPages);
            setTotalItems(totalItems);
        } catch (error: any) {
            console.error('Lỗi khi tải danh sách tour:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setCurrentPage(0);
        fetchToursData();
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const resetForm = (): void => {
        setFormData({
            name: '',
            imageUrl: '',
            destinationName: '',
            duration: '',
            price: '',
            description: '',
            status: 'ACTIVE',
            maxParticipants: '50',
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
            });
            setImagePreview(tour.imageUrl);
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    const handleDelete = async (id: number): Promise<void> => {
        setLoading(true);
        try {
            const token = getToken();
            await deleteTour(token, id);
            setTours(prev => prev.filter(tour => tour.id !== id));
            if (tours.length === 1 && currentPage > 0) {
                setCurrentPage(0);
            } else {
                fetchToursData();
            }
        } catch (error: any) {
            throw new Error(error.message || 'Xóa tour thất bại');
        } finally {
            setLoading(false);
        }
    };

    const openImageModal = (imageUrl: string) => {
        setImageModalUrl(imageUrl);
        setShowImageModal(true);
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage - 1);
        }
    };

    const handleSubmit = async () => {
        const token = getToken();
        const tourData = new FormData();
        const parsedData = {
            ...formData,
            price: parseFloat(formData.price) || 0,
            maxParticipants: parseInt(formData.maxParticipants) || 50,
        };

        tourData.append('tour', JSON.stringify(parsedData));
        if (imageFile) {
            tourData.append('image', imageFile);
        }

        setLoading(true);
        try {
            let updatedTours: Tour[];
            if (modalMode === 'add') {
                const newTour = await addTour(token, tourData);
                updatedTours = [...tours, newTour];
            } else if (selectedTour) {
                const updatedTour = await updateTour(token, selectedTour.id, tourData);
                updatedTours = tours.map(t => (t.id === selectedTour.id ? updatedTour : t));
            } else {
                throw new Error('Không có tour để cập nhật');
            }

            setTours(updatedTours);
            setShowModal(false);
            resetForm();
            fetchToursData();
        } catch (error: any) {
            throw new Error(error.message || 'Lưu tour thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-700' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
            <div className="max-w-7xl mx-auto">
                {/* BỎ shadow-lg → dùng border nhẹ */}
                <div className={`rounded-2xl p-6 mb-6 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-slate-200'}`}>
                    <h1 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                        Quản Lý Tour Du Lịch
                    </h1>

                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400`} size={20} />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên tour..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)} // ĐÃ SỬA
                                    onKeyPress={handleKeyPress}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className={`px-6 py-3 rounded-xl text-white font-medium transition-all ${theme === 'dark' ? 'bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}`}
                            >
                                Tìm kiếm
                            </button>
                            <button
                                onClick={() => openModal('add')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all ${theme === 'dark' ? 'bg-gradient-to-r from-green-700 to-emerald-800 hover:from-green-800 hover:to-emerald-900' : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'}`}
                            >
                                <Plus size={20} /> Thêm Tour Mới
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <select
                                value={selectedDestination}
                                onChange={(e) => setSelectedDestination(e.target.value)}
                                className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
                            >
                                <option value="all">Tất cả điểm đến</option>
                                {destinations.map((dest) => (
                                    <option key={dest.id} value={dest.name}>{dest.name}</option>
                                ))}
                            </select>

                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="ACTIVE">Hoạt động</option>
                                <option value="INACTIVE">Tạm ngưng</option>
                            </select>

                            <input
                                type="number"
                                placeholder="Giá tối thiểu"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
                            />
                            <input
                                type="number"
                                placeholder="Giá tối đa"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <TourStats theme={theme} />
                    </div>
                </div>

                <TourTable
                    tours={tours}
                    theme={theme}
                    onEdit={(tour) => openModal('edit', tour)}
                    onDelete={handleDelete}
                    formatCurrency={formatCurrency}
                />

                <div className="mt-6">
                    <Pagination
                        currentPage={currentPage + 1}
                        totalPages={totalPages}
                        setCurrentPage={handlePageChange}
                        loading={loading}
                        filteredUsersLength={totalItems}
                    />
                </div>
            </div>

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
            />

            <ImagePreviewModal
                isOpen={showImageModal}
                imageUrl={imageModalUrl}
                onClose={() => setShowImageModal(false)}
            />
        </div>
    );
};

export default TourManagement;