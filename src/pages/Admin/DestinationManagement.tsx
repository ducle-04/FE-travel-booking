import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import DestinationTable from '../../components/Layout/DefautLayout/AdminLayout/DestinationManagement/DestinationTable';
import DestinationFilters from '../../components/Layout/DefautLayout/AdminLayout/DestinationManagement/DestinationFilters';
import DestinationModal from '../../components/Layout/DefautLayout/AdminLayout/DestinationManagement/DestinationModal';
import ImagePreviewModal from '../../components/Layout/DefautLayout/AdminLayout/DestinationManagement/ImagePreviewModal';
import DestinationStats from '../../components/Layout/DefautLayout/AdminLayout/DestinationManagement/DestinationStats';
import {
    fetchDestinations,
    searchDestinations,
    filterDestinationsByRegion,
    saveDestination,
    deleteDestination,
} from './../../services/destinationService';

interface Destination {
    id: string;
    name: string;
    region: 'Bắc' | 'Trung' | 'Nam';
    description: string;
    imageUrl: string;
    toursCount: number;
    status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
}

const ITEMS_PER_PAGE = 10;

const DestinationManagement: React.FC = () => {
    const { theme } = useTheme();
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [regionFilter, setRegionFilter] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
    const [formData, setFormData] = useState<Omit<Destination, 'id'> & {
        imageFile?: File;
        imagePreview?: string;
    }>({
        name: '',
        region: 'Bắc',
        description: '',
        imageUrl: '',
        toursCount: 0,
        status: 'ACTIVE',
        imageFile: undefined,
        imagePreview: undefined,
    });
    const [error, setError] = useState<string | null>(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Lấy danh sách điểm đến
    useEffect(() => {
        const loadDestinations = async () => {
            try {
                const destinationsData = await fetchDestinations();
                setDestinations(destinationsData);
            } catch (err: any) {
                setError(err.message);
            }
        };
        loadDestinations();
    }, []);

    // Lọc điểm đến theo tên và khu vực
    const filteredDestinations = useMemo(() => {
        return destinations.filter(dest => {
            const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRegion = regionFilter === 'all' || dest.region === regionFilter;
            return matchesSearch && matchesRegion && dest.status !== 'DELETED';
        });
    }, [destinations, searchTerm, regionFilter]);

    // Phân trang
    const totalPages = Math.ceil(filteredDestinations.length / ITEMS_PER_PAGE);
    const paginatedDestinations = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredDestinations.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredDestinations, currentPage]);

    // Xử lý tìm kiếm theo tên
    const handleSearch = async (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
        try {
            if (term.trim()) {
                const destinationsData = await searchDestinations(term);
                setDestinations(destinationsData);
            } else {
                const destinationsData = await fetchDestinations();
                setDestinations(destinationsData);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Xử lý lọc theo khu vực
    const handleRegionFilter = async (region: string) => {
        setRegionFilter(region);
        setCurrentPage(1);
        try {
            if (region !== 'all') {
                const destinationsData = await filterDestinationsByRegion(region);
                setDestinations(destinationsData);
            } else {
                const destinationsData = await fetchDestinations();
                setDestinations(destinationsData);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleOpenModal = (destination?: Destination) => {
        if (destination) {
            setEditingDestination(destination);
            setFormData({
                name: destination.name,
                region: destination.region,
                description: destination.description,
                imageUrl: destination.imageUrl,
                toursCount: destination.toursCount,
                status: destination.status,
                imageFile: undefined,
                imagePreview: destination.imageUrl || undefined,
            });
        } else {
            setEditingDestination(null);
            setFormData({
                name: '',
                region: 'Bắc',
                description: '',
                imageUrl: '',
                toursCount: 0,
                status: 'ACTIVE',
                imageFile: undefined,
                imagePreview: undefined,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        if (formData.imagePreview && formData.imageFile) {
            URL.revokeObjectURL(formData.imagePreview);
        }
        setIsModalOpen(false);
        setEditingDestination(null);
        setError(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setFormData({ ...formData, imageFile: file, imagePreview: previewUrl });
        } else {
            setFormData({ ...formData, imageFile: undefined, imagePreview: formData.imageUrl || undefined });
        }
    };

    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setFormData({ ...formData, imageUrl: url, imagePreview: url || undefined });
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.description || !formData.region) {
            setError('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }
        if (!editingDestination && !formData.imageFile && !formData.imageUrl) {
            setError('Vui lòng tải lên ảnh hoặc cung cấp URL ảnh khi tạo điểm đến mới!');
            return;
        }

        try {
            const savedDestination = await saveDestination(formData, editingDestination?.id);
            if (editingDestination) {
                setDestinations(destinations.map(dest =>
                    dest.id === editingDestination.id ? savedDestination : dest
                ));
            } else {
                setDestinations([...destinations, savedDestination]);
            }
            handleCloseModal();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa điểm đến này?')) {
            try {
                await deleteDestination(id);
                setDestinations(destinations.filter(dest => dest.id !== id));
                if (paginatedDestinations.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
            } catch (err: any) {
                setError(err.message);
            }
        }
    };

    const handleOpenImageModal = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setIsImageModalOpen(true);
    };

    const handleCloseImageModal = () => {
        setIsImageModalOpen(false);
        setSelectedImage(null);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
            <div className="max-w-7xl mx-auto p-6">
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-slate-800'} mb-2`}>Quản lý Điểm đến</h1>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}>Quản lý và tổ chức các điểm đến du lịch trên toàn quốc</p>
                </div>

                {error && (
                    <div className={`mb-6 p-4 rounded-xl ${theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'}`}>
                        {error}
                    </div>
                )}

                <DestinationFilters
                    searchTerm={searchTerm}
                    setSearchTerm={handleSearch}
                    regionFilter={regionFilter}
                    setRegionFilter={handleRegionFilter}
                    onOpenModal={() => handleOpenModal()}
                />

                <DestinationStats destinations={destinations} />

                <DestinationTable
                    destinations={paginatedDestinations}
                    currentPage={currentPage}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onOpenModal={handleOpenModal}
                    onDelete={handleDelete}
                    onOpenImageModal={handleOpenImageModal}
                />

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${currentPage === 1
                                ? theme === 'dark' ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : theme === 'dark' ? 'bg-blue-900 text-blue-200 hover:bg-blue-800' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                }`}
                        >
                            Trước
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 rounded-xl font-medium transition-all ${currentPage === page
                                    ? theme === 'dark' ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white'
                                    : theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${currentPage === totalPages
                                ? theme === 'dark' ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : theme === 'dark' ? 'bg-blue-900 text-blue-200 hover:bg-blue-800' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                }`}
                        >
                            Sau
                        </button>
                    </div>
                )}

                <DestinationModal
                    isOpen={isModalOpen}
                    editingDestination={editingDestination}
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    onClose={handleCloseModal}
                    onFileChange={handleFileChange}
                    onImageUrlChange={handleImageUrlChange}
                    onOpenImageModal={handleOpenImageModal}
                />

                <ImagePreviewModal
                    isOpen={isImageModalOpen}
                    imageUrl={selectedImage}
                    onClose={handleCloseImageModal}
                />
            </div>
        </div>
    );
};

export default DestinationManagement;