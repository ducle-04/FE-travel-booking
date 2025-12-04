// src/pages/Admin/HotelManagement.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import HotelTable from '../../components/Layout/DefautLayout/AdminLayout/HotelManagement/HotelTable';
import HotelFormModal from '../../components/Layout/DefautLayout/AdminLayout/HotelManagement/HotelFormModal';
import ImagePreviewModal from '../../components/Layout/DefautLayout/AdminLayout/DestinationManagement/ImagePreviewModal';
import VideoPreviewModal from '../../components/Layout/DefautLayout/AdminLayout/DestinationManagement/VideoPreviewModal';
import Pagination from '../../components/Layout/DefautLayout/AdminLayout/UserManagement/Pagination';
import HotelStats from '../../components/Layout/DefautLayout/AdminLayout/HotelManagement/HotelStats';
import HotelDetailModal from '../../components/Layout/DefautLayout/AdminLayout/HotelManagement/HotelDetailModal';
import {
    fetchHotels,
    addHotel,
    updateHotel,
    deleteHotel,
    type Hotel
} from '../../services/hotelService';

const HotelManagement: React.FC = () => {
    const { theme } = useTheme();

    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [addressFilter, setAddressFilter] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<'all' | 'ACTIVE' | 'INACTIVE'>('all');
    const [selectedStar, setSelectedStar] = useState<number | ''>('');

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedDetailHotel, setSelectedDetailHotel] = useState<Hotel | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [imageModalUrl, setImageModalUrl] = useState<string | null>(null);
    const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

    const [formData, setFormData] = useState<{
        id?: number;
        name: string;
        address: string;
        starRating: number | '';
        description?: string;
        status: 'ACTIVE' | 'INACTIVE';
        images?: string[];
        videos?: string[];
    }>({
        name: '',
        address: '',
        starRating: '',
        description: '',
        status: 'ACTIVE',
        images: [],
        videos: []
    });

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [videoFiles, setVideoFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const openDetailModal = (hotel: Hotel) => {
        setSelectedDetailHotel(hotel);
        setShowDetailModal(true);
    };

    const refetchHotels = useCallback(async () => {
        setLoading(true);
        try {
            const { hotels, totalPages, totalItems } = await fetchHotels(
                currentPage,
                searchTerm || undefined,
                addressFilter || undefined,
                selectedStatus === 'all' ? undefined : selectedStatus,
                selectedStar === '' ? undefined : selectedStar
            );
            setHotels(hotels);
            setTotalPages(totalPages || 1);
            setTotalItems(totalItems);
        } catch (err) {
            console.error('Lỗi tải danh sách khách sạn:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, addressFilter, selectedStatus, selectedStar]);

    useEffect(() => {
        refetchHotels();
    }, [refetchHotels]);

    useEffect(() => {
        setCurrentPage(0);
    }, [searchTerm, addressFilter, selectedStatus, selectedStar]);

    const resetForm = () => {
        setFormData({
            name: '',
            address: '',
            starRating: '',
            description: '',
            status: 'ACTIVE',
            images: [],
            videos: []
        });
        setImageFiles([]);
        setVideoFiles([]);
        setImagePreviews([]);
        setVideoPreviews([]);
        setSelectedHotel(null);
    };

    const openModal = (mode: 'add' | 'edit', hotel?: Hotel) => {
        setModalMode(mode);
        if (mode === 'edit' && hotel) {
            setSelectedHotel(hotel);
            setFormData({
                id: hotel.id,
                name: hotel.name,
                address: hotel.address,
                starRating: hotel.starRating,
                description: hotel.description || '',
                status: hotel.status,
                images: hotel.images || [],
                videos: hotel.videos || []
            });
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!formData.name.trim() || !formData.address.trim() || formData.starRating === '') {
            alert('Vui lòng nhập đầy đủ: Tên, Địa chỉ và Số sao!');
            return;
        }

        const hotelData = new FormData();
        hotelData.append('hotel', JSON.stringify({
            name: formData.name.trim(),
            address: formData.address.trim(),
            starRating: formData.starRating,
            description: formData.description?.trim() || null,
            status: formData.status
        }));

        imageFiles.forEach(file => hotelData.append('images', file));
        videoFiles.forEach(file => hotelData.append('videos', file));

        try {
            if (modalMode === 'add') {
                await addHotel(hotelData);
            } else if (selectedHotel) {
                await updateHotel(selectedHotel.id, hotelData);
            }

            setShowModal(false);
            resetForm();
            await refetchHotels();
            setRefreshTrigger(prev => prev + 1);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Lưu khách sạn thất bại!');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteHotel(id);
            if (hotels.length === 1 && currentPage > 0) {
                setCurrentPage(prev => prev - 1);
            } else {
                await refetchHotels();
            }
            setRefreshTrigger(prev => prev + 1);
        } catch (err: any) {
            console.error('Xóa thất bại:', err);
            throw err;
        }
    };

    const openImageModal = (url: string) => {
        setImageModalUrl(url);
        setShowImageModal(true);
    };

    const openVideoModal = (url: string) => {
        setVideoModalUrl(url);
        setShowVideoModal(true);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setAddressFilter('');
        setSelectedStatus('all');
        setSelectedStar('');
    };

    return (
        <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header + Stats */}
                <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <div>
                            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                Quản Lý Khách Sạn
                            </h1>
                            <p className={`mt-2 text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Tổng: <span className="font-bold text-blue-600">{totalItems}</span> khách sạn
                            </p>
                        </div>
                        <button
                            onClick={() => openModal('add')}
                            className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                        >
                            <Plus size={20} />
                            Thêm Khách Sạn
                        </button>
                    </div>

                    <HotelStats theme={theme} refreshTrigger={refreshTrigger} />
                </div>

                {/* Filters */}
                <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm tên khách sạn..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                                    : 'bg-gray-50 border-gray-300 placeholder-gray-500 focus:border-blue-500'
                                    } focus:outline-none transition`}
                            />
                        </div>

                        <input
                            type="text"
                            placeholder="Lọc theo địa chỉ..."
                            value={addressFilter}
                            onChange={e => setAddressFilter(e.target.value)}
                            className={`px-4 py-3 rounded-lg border ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                                : 'bg-gray-50 border-gray-300 placeholder-gray-500 focus:border-blue-500'
                                } focus:outline-none transition`}
                        />

                        <select
                            value={selectedStatus}
                            onChange={e => setSelectedStatus(e.target.value as any)}
                            className={`px-4 py-3 rounded-lg border ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                : 'bg-gray-50 border-gray-300 focus:border-blue-500'
                                } focus:outline-none transition`}
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="ACTIVE">Đang hoạt động</option>
                            <option value="INACTIVE">Tạm dừng</option>
                        </select>

                        <select
                            value={selectedStar}
                            onChange={e => setSelectedStar(e.target.value === '' ? '' : Number(e.target.value))}
                            className={`px-4 py-3 rounded-lg border ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                : 'bg-gray-50 border-gray-300 focus:border-blue-500'
                                } focus:outline-none transition`}
                        >
                            <option value="">Tất cả sao</option>
                            {[5, 4, 3, 2, 1].map(s => (
                                <option key={s} value={s}>{s} sao</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={clearFilters}
                            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className={`rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                    <HotelTable
                        hotels={hotels}
                        theme={theme}
                        onEdit={hotel => openModal('edit', hotel)}
                        onViewDetail={openDetailModal}
                        onDelete={handleDelete}
                        openImageModal={openImageModal}
                        openVideoModal={openVideoModal}
                        loading={loading}
                    />
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                        <Pagination
                            currentPage={currentPage + 1}
                            totalPages={totalPages}
                            setCurrentPage={page => setCurrentPage(page - 1)}
                            loading={loading}
                            filteredUsersLength={totalItems}
                        />
                    </div>
                )}
            </div>

            {/* Modals */}
            <HotelFormModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                modalMode={modalMode}
                formData={formData}
                setFormData={setFormData}
                imageFiles={imageFiles}
                setImageFiles={setImageFiles}
                videoFiles={videoFiles}
                setVideoFiles={setVideoFiles}
                imagePreviews={imagePreviews}
                setImagePreviews={setImagePreviews}
                videoPreviews={videoPreviews}
                setVideoPreviews={setVideoPreviews}
                onSubmit={handleSubmit}
                theme={theme}
                openImageModal={openImageModal}
                openVideoModal={openVideoModal}
            />

            <HotelDetailModal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                hotel={selectedDetailHotel}
                theme={theme}
                openImageModal={openImageModal}
                openVideoModal={openVideoModal}
            />

            <ImagePreviewModal
                isOpen={showImageModal}
                imageUrl={imageModalUrl}
                onClose={() => setShowImageModal(false)}
            />

            {showVideoModal && videoModalUrl && (
                <VideoPreviewModal
                    isOpen={showVideoModal}
                    videoUrl={videoModalUrl}
                    onClose={() => setShowVideoModal(false)}
                />
            )}
        </div>
    );
};

export default HotelManagement;