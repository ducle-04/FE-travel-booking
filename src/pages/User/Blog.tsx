// src/pages/User/BlogListPage.tsx
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    Search, Grid, List, Plus, X, Upload, Image as Send
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    fetchPublishedBlogs,
    createBlog
} from '../../services/blogService';
import type { BlogSummaryDTO } from '../../types/blogTypes';

export default function BlogListPage() {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [blogs, setBlogs] = useState<BlogSummaryDTO[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    // Load blogs
    useEffect(() => {
        loadBlogs();
    }, [page]);

    const loadBlogs = async () => {
        setLoading(true);
        try {
            const res = await fetchPublishedBlogs(page, 10);
            let filtered = res.content;

            if (searchKeyword.trim()) {
                const term = searchKeyword.toLowerCase();
                filtered = filtered.filter((b: BlogSummaryDTO) =>
                    b.title.toLowerCase().includes(term) ||
                    b.shortDescription.toLowerCase().includes(term)
                );
            }

            setBlogs(filtered);
            setTotalPages(res.totalPages || 1);
        } catch (err) {
            toast.error('Không thể tải danh sách bài viết');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => loadBlogs();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleCreateBlog = async () => {
        if (!newTitle.trim() || !newContent.trim()) {
            toast.error('Vui lòng nhập tiêu đề và nội dung');
            return;
        }
        if (!thumbnailFile) {
            toast.error('Vui lòng chọn ảnh bìa');
            return;
        }

        try {
            setLoading(true);
            await createBlog(
                { title: newTitle, content: newContent },
                thumbnailFile,
                galleryFiles
            );

            toast.success('Gửi bài viết thành công! Đang chờ duyệt');
            setIsModalOpen(false);
            resetModal();
            loadBlogs();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Đăng bài thất bại');
        } finally {
            setLoading(false);
        }
    };

    const resetModal = () => {
        setNewTitle('');
        setNewContent('');
        setThumbnailFile(null);
        setGalleryFiles([]);
        setThumbnailPreview('');
        setGalleryPreviews([]);
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Hero */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-48 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">Travel Blog</h1>
                        <p className="text-xl text-cyan-600 mb-10">Khám phá và chia sẻ những hành trình tuyệt vời</p>

                        <div className="max-w-2xl mx-auto">
                            <div className="relative flex items-center gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm bài viết du lịch..."
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-200 focus:border-cyan-500 focus:outline-none text-lg"
                                    />
                                </div>
                                <button
                                    onClick={handleSearch}
                                    className="bg-cyan-600 text-white px-8 py-4 rounded-full hover:bg-cyan-700 font-medium shadow-lg"
                                >
                                    Tìm kiếm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-12 max-w-7xl">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">{blogs.length} Bài viết</h2>
                                <p className="text-gray-600 mt-1">Khám phá những câu chuyện du lịch mới nhất</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-3 rounded-md transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-cyan-600' : 'text-gray-600'}`}
                                    >
                                        <Grid size={20} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-3 rounded-md transition ${viewMode === 'list' ? 'bg-white shadow-sm text-cyan-600' : 'text-gray-600'}`}
                                    >
                                        <List size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Danh sách blog - Tách riêng Grid và List View */}
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-600 border-t-transparent"></div>
                        </div>
                    ) : (
                        <>
                            {/* ==================== GRID VIEW ==================== */}
                            {viewMode === 'grid' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {blogs.map((blog) => (
                                        <article
                                            key={blog.id}
                                            onClick={() => navigate(`/blog/${blog.id}`)}
                                            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border border-gray-200 group flex flex-col"
                                        >
                                            {/* Ảnh */}
                                            <div className="relative overflow-hidden h-64">
                                                <img
                                                    src={blog.thumbnail}
                                                    alt={blog.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>

                                            {/* Nội dung */}
                                            <div className="p-6 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 line-clamp-2">
                                                        {blog.title}
                                                    </h3>
                                                    <p className="text-gray-600 mb-4 line-clamp-3">{blog.shortDescription}</p>

                                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                                        <span className="font-medium text-gray-800">{blog.authorName}</span>
                                                        <span>{formatDate(blog.createdAt)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex gap-5 text-gray-600">
                                                        <span>{blog.views.toLocaleString()} lượt xem</span>
                                                        <span>{blog.commentCount} bình luận</span>
                                                    </div>
                                                    <span className="text-cyan-600 font-medium hover:underline">
                                                        Đọc thêm →
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}

                            {/* ==================== LIST VIEW (ảnh trái - nội dung phải) ==================== */}
                            {viewMode === 'list' && (
                                <div className="space-y-8">
                                    {blogs.map((blog) => (
                                        <article
                                            key={blog.id}
                                            onClick={() => navigate(`/blog/${blog.id}`)}
                                            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all cursor-pointer border border-gray-200 group flex flex-col lg:flex-row"
                                        >
                                            {/* Ảnh bên trái */}
                                            <div className="relative overflow-hidden lg:w-96 lg:h-auto h-64 flex-shrink-0">
                                                <img
                                                    src={blog.thumbnail}
                                                    alt={blog.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition" />
                                            </div>

                                            {/* Nội dung bên phải */}
                                            <div className="p-6 lg:p-8 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-cyan-600 line-clamp-2">
                                                        {blog.title}
                                                    </h3>
                                                    <p className="text-gray-600 mb-5 line-clamp-3 lg:line-clamp-4 text-base">
                                                        {blog.shortDescription}
                                                    </p>

                                                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                                                        <span className="font-medium text-gray-800">{blog.authorName}</span>
                                                        <span>{formatDate(blog.createdAt)}</span>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex gap-6 text-sm text-gray-600">
                                                            <span>{blog.views.toLocaleString()} lượt xem</span>
                                                            <span>{blog.commentCount} bình luận</span>
                                                        </div>
                                                        <span className="text-cyan-600 font-semibold hover:underline text-lg">
                                                            Đọc thêm →
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-3 mt-12">
                            <button
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="px-6 py-3 rounded-lg border disabled:opacity-50"
                            >
                                Trước
                            </button>
                            <span className="px-6 py-3">Trang {page + 1} / {totalPages}</span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}
                                className="px-6 py-3 rounded-lg border disabled:opacity-50"
                            >
                                Sau
                            </button>
                        </div>
                    )}
                </div>

                {/* FAB */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="fixed bottom-[120px] right-8 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white w-48 h-16 rounded-full shadow-2xl hover:scale-110 transition z-50 flex items-center justify-center gap-3"
                >
                    <Plus size={32} />
                    <span className="font-bold">Viết bài</span>
                </button>

                {/* Modal Viết Blog */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-3xl font-bold">Viết bài mới</h2>
                                    <button onClick={() => { setIsModalOpen(false); resetModal(); }} className="p-2 hover:bg-gray-100 rounded-lg">
                                        <X size={28} />
                                    </button>
                                </div>

                                <div className="space-y-7">
                                    {/* Tiêu đề */}
                                    <div>
                                        <label className="block font-semibold mb-2">Tiêu đề <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={newTitle}
                                            onChange={e => setNewTitle(e.target.value)}
                                            placeholder="Tiêu đề hấp dẫn..."
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                                        />
                                    </div>

                                    {/* Ảnh bìa */}
                                    <div>
                                        <label className="block font-semibold mb-2">Ảnh bìa <span className="text-red-500">*</span></label>
                                        <label className="block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-cyan-500">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setThumbnailFile(file);
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => setThumbnailPreview(reader.result as string);
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                            {thumbnailPreview ? (
                                                <img src={thumbnailPreview} alt="Preview" className="mx-auto max-h-64 rounded-lg" />
                                            ) : (
                                                <>
                                                    <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                                                    <p>Click để chọn ảnh bìa</p>
                                                </>
                                            )}
                                        </label>
                                    </div>

                                    {/* Ảnh phụ */}
                                    <div>
                                        <label className="block font-semibold mb-2">Ảnh phụ (tối đa 20)</label>
                                        <label className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={(e) => {
                                                    const files = Array.from(e.target.files || []);
                                                    setGalleryFiles(prev => [...prev, ...files].slice(0, 20));
                                                    files.forEach(file => {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setGalleryPreviews(prev => [...prev, reader.result as string]);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    });
                                                }}
                                            />
                                            <Upload size={40} className="mx-auto text-gray-400 mb-3" />
                                            <p>Thêm ảnh phụ</p>
                                            <p className="text-sm text-gray-500 mt-2">{galleryFiles.length}/20</p>
                                        </label>

                                        {galleryPreviews.length > 0 && (
                                            <div className="grid grid-cols-5 gap-3 mt-4">
                                                {galleryPreviews.map((src, i) => (
                                                    <div key={i} className="relative group">
                                                        <img src={src} className="h-24 rounded-lg object-cover" />
                                                        <button
                                                            onClick={() => {
                                                                setGalleryFiles(prev => prev.filter((_, idx) => idx !== i));
                                                                setGalleryPreviews(prev => prev.filter((_, idx) => idx !== i));
                                                            }}
                                                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Nội dung */}
                                    <div>
                                        <label className="block font-semibold mb-2">Nội dung <span className="text-red-500">*</span></label>
                                        <textarea
                                            value={newContent}
                                            onChange={e => setNewContent(e.target.value)}
                                            rows={15}
                                            placeholder="Chia sẻ hành trình của bạn..."
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
                                        />
                                    </div>

                                    <div className="flex gap-4 pt-6 border-t">
                                        <button
                                            onClick={handleCreateBlog}
                                            disabled={loading || !newTitle || !newContent || !thumbnailFile}
                                            className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white py-4 rounded-lg font-bold hover:from-cyan-700 hover:to-cyan-800 disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {loading ? 'Đang gửi...' : 'Đăng bài viết'}
                                            <Send size={22} />
                                        </button>
                                        <button
                                            onClick={() => { setIsModalOpen(false); resetModal(); }}
                                            className="px-8 py-4 border rounded-lg hover:bg-gray-50"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}