import React, { useState, useEffect } from 'react';
import { Trash2, Check, X, Eye, Calendar, User, FileImage } from 'lucide-react';

// Types
type BlogStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
type FilterStatus = BlogStatus | 'ALL';

interface Blog {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    authorName: string;
    authorId: number;
    createdAt: string;
    status: BlogStatus;
    views: number;
    images?: string[];
}

interface StatusConfig {
    bg: string;
    text: string;
    label: string;
}

// Components
const AdminBlogManagement: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);

    useEffect(() => {
        fetchBlogs();
    }, [filterStatus]);

    const fetchBlogs = async (): Promise<void> => {
        setLoading(true);
        // Mock API call - thay đổi endpoint theo backend của bạn
        setTimeout(() => {
            const mockData: Blog[] = [
                {
                    id: 1,
                    title: 'Khám phá vẻ đẹp Hạ Long',
                    content: 'Vịnh Hạ Long là một trong những di sản thiên nhiên thế giới...',
                    thumbnail: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400',
                    authorName: 'Nguyễn Văn A',
                    authorId: 101,
                    createdAt: '2024-01-15T10:30:00',
                    status: 'PENDING',
                    views: 0,
                    images: ['url1', 'url2']
                },
                {
                    id: 2,
                    title: 'Du lịch Đà Lạt mùa hoa',
                    content: 'Đà Lạt vào mùa hoa rực rỡ sắc màu...',
                    thumbnail: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400',
                    authorName: 'Trần Thị B',
                    authorId: 102,
                    createdAt: '2024-01-16T14:20:00',
                    status: 'APPROVED',
                    views: 245,
                    images: ['url1', 'url2', 'url3']
                },
                {
                    id: 3,
                    title: 'Phố cổ Hội An về đêm',
                    content: 'Hội An về đêm lung linh đèn lồng...',
                    thumbnail: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400',
                    authorName: 'Lê Văn C',
                    authorId: 103,
                    createdAt: '2024-01-17T09:15:00',
                    status: 'REJECTED',
                    views: 0,
                    images: ['url1']
                },
                {
                    id: 4,
                    title: 'Trekking Sapa - Chinh phục Fansipan',
                    content: 'Hành trình chinh phục nóc nhà Đông Dương...',
                    thumbnail: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400',
                    authorName: 'Phạm Thị D',
                    authorId: 104,
                    createdAt: '2024-01-18T16:45:00',
                    status: 'PENDING',
                    views: 0,
                    images: ['url1', 'url2', 'url3', 'url4']
                }
            ];

            const filtered = filterStatus === 'ALL'
                ? mockData
                : mockData.filter(b => b.status === filterStatus);

            setBlogs(filtered);
            setLoading(false);
        }, 500);
    };

    const handleApprove = async (blogId: number): Promise<void> => {
        try {
            // API call: PATCH /api/blogs/{id}/approve
            // await fetch(`/api/blogs/${blogId}/approve`, { method: 'PATCH' });

            setBlogs(blogs.map(blog =>
                blog.id === blogId ? { ...blog, status: 'APPROVED' as BlogStatus } : blog
            ));
            alert('Đã duyệt bài viết thành công!');
        } catch (error) {
            alert('Có lỗi xảy ra khi duyệt bài viết');
        }
    };

    const handleReject = async (blogId: number): Promise<void> => {
        try {
            // API call: PATCH /api/blogs/{id}/reject
            // await fetch(`/api/blogs/${blogId}/reject`, { method: 'PATCH' });

            setBlogs(blogs.map(blog =>
                blog.id === blogId ? { ...blog, status: 'REJECTED' as BlogStatus } : blog
            ));
            alert('Đã từ chối bài viết!');
        } catch (error) {
            alert('Có lỗi xảy ra khi từ chối bài viết');
        }
    };

    const handleDelete = async (blogId: number): Promise<void> => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;

        try {
            // API call: DELETE /api/blogs/{id}
            // await fetch(`/api/blogs/${blogId}`, { method: 'DELETE' });

            setBlogs(blogs.filter(blog => blog.id !== blogId));
            setShowModal(false);
            alert('Đã xóa bài viết thành công!');
        } catch (error) {
            alert('Có lỗi xảy ra khi xóa bài viết');
        }
    };

    const getStatusBadge = (status: BlogStatus) => {
        const statusConfig: Record<BlogStatus, StatusConfig> = {
            PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Chờ duyệt' },
            APPROVED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Đã duyệt' },
            REJECTED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Từ chối' }
        };

        const config = statusConfig[status];
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const BlogDetailModal: React.FC<{ blog: Blog | null; onClose: () => void }> = ({ blog, onClose }) => {
        if (!blog) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">Chi tiết bài viết</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-6">
                        <img
                            src={blog.thumbnail}
                            alt={blog.title}
                            className="w-full h-64 object-cover rounded-lg mb-6"
                        />

                        <div className="mb-4">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{blog.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                <span className="flex items-center gap-1">
                                    <User size={16} />
                                    {blog.authorName}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar size={16} />
                                    {formatDate(blog.createdAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Eye size={16} />
                                    {blog.views} lượt xem
                                </span>
                                <span className="flex items-center gap-1">
                                    <FileImage size={16} />
                                    {blog.images?.length || 0} ảnh
                                </span>
                            </div>
                            {getStatusBadge(blog.status)}
                        </div>

                        <div className="prose max-w-none mb-6">
                            <h4 className="text-lg font-semibold mb-2">Nội dung:</h4>
                            <div className="text-gray-700 whitespace-pre-wrap">{blog.content}</div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t">
                            {blog.status === 'PENDING' && (
                                <>
                                    <button
                                        onClick={() => {
                                            handleApprove(blog.id);
                                            onClose();
                                        }}
                                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                                    >
                                        <Check size={20} />
                                        Duyệt bài
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleReject(blog.id);
                                            onClose();
                                        }}
                                        className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center justify-center gap-2"
                                    >
                                        <X size={20} />
                                        Từ chối
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => handleDelete(blog.id)}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                            >
                                <Trash2 size={20} />
                                Xóa bài viết
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Blog</h1>

                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={() => setFilterStatus('ALL')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filterStatus === 'ALL'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Tất cả ({blogs.length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('PENDING')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filterStatus === 'PENDING'
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Chờ duyệt
                        </button>
                        <button
                            onClick={() => setFilterStatus('APPROVED')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filterStatus === 'APPROVED'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Đã duyệt
                        </button>
                        <button
                            onClick={() => setFilterStatus('REJECTED')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filterStatus === 'REJECTED'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Từ chối
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <p className="text-gray-500 text-lg">Không có bài viết nào</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {blogs.map(blog => (
                            <div key={blog.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition">
                                <div className="flex gap-4 p-6">
                                    <img
                                        src={blog.thumbnail}
                                        alt={blog.title}
                                        className="w-48 h-32 object-cover rounded-lg flex-shrink-0"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <h3 className="text-xl font-bold text-gray-800 truncate">{blog.title}</h3>
                                            {getStatusBadge(blog.status)}
                                        </div>

                                        <p className="text-gray-600 mb-3 line-clamp-2">{blog.content}</p>

                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <User size={16} />
                                                {blog.authorName}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar size={16} />
                                                {formatDate(blog.createdAt)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye size={16} />
                                                {blog.views} lượt xem
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FileImage size={16} />
                                                {blog.images?.length || 0} ảnh
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedBlog(blog);
                                                setShowModal(true);
                                            }}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                                        >
                                            <Eye size={18} />
                                            Xem
                                        </button>

                                        {blog.status === 'PENDING' && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(blog.id)}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                                                >
                                                    <Check size={18} />
                                                    Duyệt
                                                </button>
                                                <button
                                                    onClick={() => handleReject(blog.id)}
                                                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition flex items-center gap-2"
                                                >
                                                    <X size={18} />
                                                    Từ chối
                                                </button>
                                            </>
                                        )}

                                        <button
                                            onClick={() => handleDelete(blog.id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                                        >
                                            <Trash2 size={18} />
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <BlogDetailModal
                    blog={selectedBlog}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedBlog(null);
                    }}
                />
            )}
        </div>
    );
};

export default AdminBlogManagement;