import React, { useState } from 'react';
import {
    Search, Calendar, Eye, MessageCircle, Grid, List, Plus, X,
    Upload, Image as ImageIcon, Send
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Types
interface BlogAuthor {
    name: string;
    avatar: string;
}

interface Blog {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    author: BlogAuthor;
    createdAt: string;
    views: number;
    commentCount: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

// Mock data gốc
const mockBlogs: Blog[] = [
    {
        id: 1,
        title: "Khám phá vẻ đẹp Vịnh Hạ Long - Di sản thế giới UNESCO",
        content: "Vịnh Hạ Long là một trong những kỳ quan thiên nhiên tuyệt đẹp của Việt Nam với hàng nghìn hòn đảo đá vôi nhấp nhô trên mặt nước...",
        thumbnail: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800",
        author: { name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/150?img=1" },
        createdAt: "2024-11-15T10:00:00",
        views: 1234,
        commentCount: 15,
        status: 'APPROVED'
    },
    {
        id: 2,
        title: "Sapa mùa lúa chín - Thiên đường nơi hạ giới",
        content: "Sapa trong mùa lúa chín là một bức tranh thiên nhiên tuyệt đẹp với những thửa ruộng bậc thang vàng óng...",
        thumbnail: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800",
        author: { name: "Trần Thị B", avatar: "https://i.pravatar.cc/150?img=2" },
        createdAt: "2024-11-14T15:30:00",
        views: 856,
        commentCount: 8,
        status: 'APPROVED'
    },
    {
        id: 3,
        title: "Phố cổ Hội An - Nơi lưu giữ hồn Việt qua thời gian",
        content: "Hội An là thành phố cổ kính với những con phố rợp bóng cây và hàng trăm ngôi nhà cổ mang đậm dấu ấn lịch sử...",
        thumbnail: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800",
        author: { name: "Lê Văn C", avatar: "https://i.pravatar.cc/150?img=3" },
        createdAt: "2024-11-13T09:15:00",
        views: 2105,
        commentCount: 23,
        status: 'APPROVED'
    },
    {
        id: 4,
        title: "Đà Lạt - Thành phố ngàn hoa mộng mơ",
        content: "Đà Lạt luôn là điểm đến yêu thích với khí hậu mát mẻ quanh năm và những vườn hoa rực rỡ sắc màu...",
        thumbnail: "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=800",
        author: { name: "Phạm Thị D", avatar: "https://i.pravatar.cc/150?img=4" },
        createdAt: "2024-11-12T14:20:00",
        views: 1567,
        commentCount: 12,
        status: 'APPROVED'
    },
    {
        id: 5,
        title: "Phú Quốc - Đảo ngọc thiên đường biển xanh",
        content: "Phú Quốc không chỉ nổi tiếng với những bãi biển tuyệt đẹp mà còn có ẩm thực phong phú và con người thân thiện...",
        thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
        author: { name: "Hoàng Văn E", avatar: "https://i.pravatar.cc/150?img=5" },
        createdAt: "2024-11-11T11:00:00",
        views: 1890,
        commentCount: 18,
        status: 'APPROVED'
    },
    {
        id: 6,
        title: "Ninh Bình - Vịnh Hạ Long trên cạn",
        content: "Ninh Bình với danh lam thắng cảnh Tràng An, Tam Cốc - Bích Động là điểm đến không thể bỏ lỡ...",
        thumbnail: "https://images.unsplash.com/photo-1601981698105-cbbf46d317c8?w=800",
        author: { name: "Võ Thị F", avatar: "https://i.pravatar.cc/150?img=6" },
        createdAt: "2024-11-10T08:45:00",
        views: 945,
        commentCount: 7,
        status: 'APPROVED'
    }
];

export default function BlogListPage() {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('newest');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [blogs, setBlogs] = useState<Blog[]>(mockBlogs);
    const [loading, setLoading] = useState(false);
    const [galleryImages, setGalleryImages] = useState<string[]>([]); // ← thêm dòng này thôi

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newThumbnail, setNewThumbnail] = useState('');

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const handleSearch = () => {
        setLoading(true);
        setTimeout(() => {
            const filtered = searchKeyword.trim()
                ? mockBlogs.filter(blog =>
                    blog.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                    blog.content.toLowerCase().includes(searchKeyword.toLowerCase())
                )
                : mockBlogs;
            setBlogs(filtered);
            setLoading(false);
        }, 500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    const sortedBlogs = [...blogs].sort((a, b) => {
        if (sortBy === 'views') return b.views - a.views;
        if (sortBy === 'comments') return b.commentCount - a.commentCount;
        if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const handleBlogClick = (id: number) => {
        navigate(`/blog/${id}`);
    };

    const handleCreateBlog = () => {
        if (!newTitle.trim() || !newContent.trim()) return;

        const newBlog: Blog = {
            id: Date.now(),
            title: newTitle,
            content: newContent,
            thumbnail: newThumbnail || `https://picsum.photos/800/600?random=${Date.now()}`,
            author: { name: "Bạn", avatar: "https://i.pravatar.cc/150?u=user" },
            createdAt: new Date().toISOString(),
            views: 0,
            commentCount: 0,
            status: 'PENDING'
        };

        setBlogs([newBlog, ...blogs]);
        setIsModalOpen(false);
        setNewTitle('');
        setNewContent('');
        setNewThumbnail('');
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Hero Header */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-48 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                            Travel Blog
                        </h1>
                        <p className="text-xl text-cyan-600 mb-10">
                            Khám phá và chia sẻ những hành trình tuyệt vời nhất
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative flex items-center gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm bài viết du lịch..."
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-200 focus:border-cyan-500 focus:outline-none transition text-gray-800 text-lg"
                                    />
                                </div>
                                <button
                                    onClick={handleSearch}
                                    className="bg-cyan-600 text-white px-8 py-4 rounded-full hover:bg-cyan-700 transition font-medium shadow-lg"
                                >
                                    Tìm kiếm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-12 max-w-7xl">
                    {/* Toolbar */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">{sortedBlogs.length} Bài viết</h2>
                                <p className="text-gray-600 mt-1">Những câu chuyện du lịch đang chờ bạn khám phá</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                >
                                    <option value="newest">Mới nhất</option>
                                    <option value="oldest">Cũ nhất</option>
                                    <option value="views">Lượt xem nhiều</option>
                                    <option value="comments">Nhiều bình luận</option>
                                </select>

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

                    {/* Loading */}
                    {loading && (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-600 border-t-transparent"></div>
                            <p className="mt-4 text-gray-600">Đang tìm kiếm...</p>
                        </div>
                    )}

                    {/* Blog List */}
                    {!loading && (
                        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : 'space-y-8'}>
                            {sortedBlogs.map((blog) => (
                                <article
                                    key={blog.id}
                                    onClick={() => handleBlogClick(blog.id)}
                                    className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border border-gray-200 group ${viewMode === 'list' ? 'flex flex-col lg:flex-row' : ''
                                        }`}
                                >
                                    {/* Thumbnail */}
                                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'lg:w-96 h-80' : 'h-64'}`}>
                                        <img
                                            src={blog.thumbnail}
                                            alt={blog.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        {blog.status === 'PENDING' && (
                                            <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                                Chờ duyệt
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 lg:p-8 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition line-clamp-2">
                                                {blog.title}
                                            </h3>
                                            <p className="text-gray-600 mb-5 line-clamp-3">{blog.content}</p>

                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <img src={blog.author.avatar} alt="" className="w-9 h-9 rounded-full" />
                                                    <span className="font-medium text-gray-800">{blog.author.name}</span>
                                                </div>
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={16} />
                                                    {formatDate(blog.createdAt)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-5 border-t flex items-center justify-between">
                                            <div className="flex items-center gap-5 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Eye size={18} /> {blog.views.toLocaleString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageCircle size={18} /> {blog.commentCount}
                                                </span>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleBlogClick(blog.id);
                                                }}
                                                className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition font-medium"
                                            >
                                                Đọc thêm →
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && sortedBlogs.length === 0 && (
                        <div className="text-center py-20">
                            <Search className="w-20 h-20 mx-auto text-gray-300 mb-6" />
                            <h3 className="text-2xl font-semibold text-gray-700 mb-3">Không tìm thấy bài viết</h3>
                            <p className="text-gray-500">Thử thay đổi từ khóa hoặc viết bài mới nhé!</p>
                        </div>
                    )}
                </div>

                {/* Floating Action Button */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="fixed bottom-8 left-8 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white w-16 h-16 rounded-full shadow-2xl hover:scale-110 transition flex items-center justify-center z-50"

                >
                    <Plus size={32} />
                </button>

                {/* Modal Create Blog – ĐÃ TÍCH HỢP SẴN ĐĂNG NHIỀU ẢNH PHỤ (GALLERY) */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto">
                            <div className="p-8">

                                {/* Header */}
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-3xl font-bold text-gray-900">Viết bài mới</h2>
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            setNewTitle('');
                                            setNewContent('');
                                            setNewThumbnail('');
                                            setGalleryImages([]); // ← reset gallery luôn
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        <X size={28} />
                                    </button>
                                </div>

                                <div className="space-y-7">

                                    {/* Tiêu đề */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Tiêu đề bài viết <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            placeholder="Nhập tiêu đề hấp dẫn..."
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                                        />
                                    </div>

                                    {/* Ảnh bìa (thumbnail) */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Ảnh bìa bài viết (tùy chọn)
                                        </label>
                                        <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-cyan-500 transition cursor-pointer group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => setNewThumbnail(reader.result as string);
                                                    reader.readAsDataURL(file);
                                                }}
                                            />
                                            {newThumbnail ? (
                                                <div className="space-y-4">
                                                    <img src={newThumbnail} alt="Preview bìa" className="mx-auto max-h-64 rounded-lg object-cover shadow-md" />
                                                    <p className="text-cyan-600 text-sm font-medium">Nhấp để thay ảnh bìa</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <Upload size={40} className="mx-auto text-gray-400" />
                                                    <p className="text-gray-700 font-medium">Nhấp để chọn ảnh bìa</p>
                                                    <p className="text-xs text-gray-500">Hoặc kéo thả vào đây</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* ĐĂNG NHIỀU ẢNH PHỤ – ĐÃ TÍCH HỢP SẴN */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Ảnh phụ trong bài (tùy chọn – tối đa 20 ảnh)
                                        </label>

                                        {/* Nút + preview grid */}
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                                            <div className="flex items-center justify-center mb-5">
                                                <label className="cursor-pointer flex items-center gap-3 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-medium">
                                                    <Upload size={20} />
                                                    Thêm ảnh phụ
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const files = e.target.files;
                                                            if (!files || files.length === 0) return;

                                                            const newPreviews: string[] = [];
                                                            let processed = 0;

                                                            Array.from(files).forEach((file, idx) => {
                                                                if (galleryImages.length + processed >= 20) {
                                                                    alert("Tối đa chỉ được 20 ảnh phụ!");
                                                                    return;
                                                                }
                                                                if (!file.type.startsWith("image/")) return;
                                                                if (file.size > 10 * 1024 * 1024) {
                                                                    alert(`Ảnh "${file.name}" quá 10MB`);
                                                                    return;
                                                                }

                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    newPreviews.push(reader.result as string);
                                                                    processed++;
                                                                    if (processed === files.length) {
                                                                        setGalleryImages(prev => [...prev, ...newPreviews]);
                                                                    }
                                                                };
                                                                reader.readAsDataURL(file);
                                                            });
                                                        }}
                                                    />
                                                </label>
                                                <span className="ml-4 text-sm text-gray-600">
                                                    {galleryImages.length > 0 ? `${galleryImages.length}/20 ảnh` : "Chưa chọn ảnh nào"}
                                                </span>
                                            </div>

                                            {/* Grid ảnh đã chọn */}
                                            {galleryImages.length > 0 && (
                                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                                    {galleryImages.map((src, idx) => (
                                                        <div key={idx} className="relative group rounded-lg overflow-hidden shadow">
                                                            <img src={src} alt={`Ảnh ${idx + 1}`} className="w-full h-32 object-cover" />
                                                            <button
                                                                onClick={() => setGalleryImages(prev => prev.filter((_, i) => i !== idx))}
                                                                className="absolute top-1 right-1 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                            <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                                                                {idx + 1}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {galleryImages.length === 0 && (
                                                <div className="text-center py-10 text-gray-400">
                                                    <ImageIcon size={48} className="mx-auto mb-2" />
                                                    <p className="text-sm">Chưa có ảnh phụ nào</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Nội dung */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Nội dung bài viết <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={newContent}
                                            onChange={(e) => setNewContent(e.target.value)}
                                            rows={12}
                                            placeholder="Chia sẻ hành trình của bạn..."
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none"
                                        />
                                    </div>

                                    {/* Nút */}
                                    <div className="flex gap-4 pt-6 border-t">
                                        <button
                                            onClick={handleCreateBlog}
                                            disabled={!newTitle.trim() || !newContent.trim()}
                                            className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white py-4 rounded-lg font-semibold hover:from-cyan-700 hover:to-cyan-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <Send size={22} />
                                            Đăng bài viết
                                        </button>
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-8 py-4 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
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