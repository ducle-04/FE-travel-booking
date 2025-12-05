// src/pages/Admin/AdminBlogManagement.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import {
    Trash2, X, Eye, Calendar, User, Loader2, ShieldCheck, Ban,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { axiosInstance } from '../../services/bookingService';

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
    images: string[];
}

// API Service
const blogAdminApi = {
    fetchAllBlogs: async (): Promise<Blog[]> => {
        const res = await axiosInstance.get('/blogs/admin/all');
        return res.data.data;
    },
    approveBlog: async (id: number): Promise<void> => {
        await axiosInstance.patch(`/blogs/${id}/approve`);
    },
    rejectBlog: async (id: number): Promise<void> => {
        await axiosInstance.patch(`/blogs/${id}/reject`);
    },
    deleteBlog: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/blogs/${id}`);
    }
};

const AdminBlogManagement: React.FC = () => {
    const { theme } = useTheme();

    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadBlogs();
    }, []);

    useEffect(() => {
        if (filterStatus === 'ALL') {
            setFilteredBlogs(blogs);
        } else {
            setFilteredBlogs(blogs.filter(b => b.status === filterStatus));
        }
    }, [filterStatus, blogs]);

    const loadBlogs = async () => {
        setLoading(true);
        try {
            const data = await blogAdminApi.fetchAllBlogs();
            setBlogs(data);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Không thể tải danh sách bài viết');
        } finally {
            setLoading(false);
        }
    };

    // === XÁC NHẬN HÀNH ĐỘNG ĐẸP NHƯ TOURFORMMODAL ===
    const confirmApprove = async (blog: Blog) => {
        const result = await Swal.fire({
            title: 'Duyệt bài viết?',
            html: `
                <div class="text-left">
                    <p class="font-semibold text-lg mb-2">${blog.title}</p>
                    <p class="text-sm text-gray-600">Tác giả: <span class="font-medium">${blog.authorName}</span></p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Duyệt ngay',
            cancelButtonText: 'Hủy',
            reverseButtons: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'px-6 py-3 rounded-xl font-medium',
                cancelButton: 'px-6 py-3 rounded-xl font-medium'
            }
        });

        if (!result.isConfirmed) return;

        setActionLoading(true);
        try {
            await blogAdminApi.approveBlog(blog.id);
            setBlogs(prev => prev.map(b => b.id === blog.id ? { ...b, status: 'APPROVED' } : b));
            toast.success('Đã duyệt bài viết thành công!');
        } catch {
            toast.error('Duyệt thất bại');
        } finally {
            setActionLoading(false);
        }
    };

    const confirmReject = async (blog: Blog) => {
        const result = await Swal.fire({
            title: 'Từ chối bài viết?',
            html: `
                <div class="text-left">
                    <p class="font-semibold text-lg mb-2">${blog.title}</p>
                    <p class="text-sm text-gray-600">Tác giả: <span class="font-medium">${blog.authorName}</span></p>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Từ chối',
            cancelButtonText: 'Hủy',
            reverseButtons: true,
            confirmButtonColor: '#f59e0b',
            cancelButtonColor: '#6b7280',
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'px-6 py-3 rounded-xl font-medium',
                cancelButton: 'px-6 py-3 rounded-xl font-medium'
            }
        });

        if (!result.isConfirmed) return;

        setActionLoading(true);
        try {
            await blogAdminApi.rejectBlog(blog.id);
            setBlogs(prev => prev.map(b => b.id === blog.id ? { ...b, status: 'REJECTED' } : b));
            toast.success('Đã từ chối bài viết');
        } catch {
            toast.error('Từ chối thất bại');
        } finally {
            setActionLoading(false);
        }
    };

    const confirmDelete = async (blog: Blog) => {
        const result = await Swal.fire({
            title: 'XÓA VĨNH VIỄN bài viết?',
            html: `
                <div class="text-left">
                    <p class="font-semibold text-lg mb-2">${blog.title}</p>
                    <p class="text-sm text-gray-600">Tác giả: <span class="font-medium">${blog.authorName}</span></p>
                    <p class="text-sm text-red-600 font-medium mt-3">Không thể khôi phục sau khi xóa!</p>
                </div>
            `,
            icon: 'warning',
            iconHtml: '<AlertTriangle class="w-12 h-12 text-red-600" />',
            showCancelButton: true,
            confirmButtonText: 'Xóa vĩnh viễn',
            cancelButtonText: 'Hủy',
            reverseButtons: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'px-6 py-3 rounded-xl font-medium',
                cancelButton: 'px-6 py-3 rounded-xl font-medium'
            }
        });

        if (!result.isConfirmed) return;

        setActionLoading(true);
        try {
            await blogAdminApi.deleteBlog(blog.id);
            setBlogs(prev => prev.filter(b => b.id !== blog.id));
            toast.success('Đã xóa bài viết vĩnh viễn');
            if (showDetailModal && selectedBlog?.id === blog.id) {
                setShowDetailModal(false);
            }
        } catch {
            toast.error('Xóa thất bại');
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusBadge = (status: BlogStatus) => {
        const config = {
            PENDING: { bg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', label: 'Chờ duyệt' },
            APPROVED: { bg: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', label: 'Đã duyệt' },
            REJECTED: { bg: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', label: 'Từ chối' }
        }[status];

        return (
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg}`}>
                {config.label}
            </span>
        );
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Modal chi tiết
    const BlogDetailModal = ({ blog, onClose }: { blog: Blog | null; onClose: () => void }) => {
        if (!blog) return null;

        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className={`rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className={`border-b p-6 flex justify-between items-center ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Chi tiết bài viết</h2>
                        <button onClick={onClose} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <img src={blog.thumbnail} alt={blog.title} className="w-full h-80 object-cover rounded-xl" />

                        <div>
                            <h3 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{blog.title}</h3>
                            <div className="flex flex-wrap gap-6 text-sm">
                                <span className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <User size={16} /> {blog.authorName}
                                </span>
                                <span className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <Calendar size={16} /> {formatDate(blog.createdAt)}
                                </span>
                                <span className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <Eye size={16} /> {blog.views} lượt xem
                                </span>
                                {getStatusBadge(blog.status)}
                            </div>
                        </div>

                        <div className={`prose prose-lg max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
                            <div className={`whitespace-pre-wrap leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                {blog.content}
                            </div>
                        </div>

                        {blog.images.length > 0 && (
                            <div>
                                <h4 className={`font-semibold text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    Ảnh trong bài ({blog.images.length})
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {blog.images.map((img, i) => (
                                        <img key={i} src={img} alt="" className="w-full h-40 object-cover rounded-lg border border-gray-300 dark:border-gray-600" />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className={`flex gap-4 pt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                            {blog.status === 'PENDING' && (
                                <>
                                    <button
                                        onClick={() => confirmApprove(blog)}
                                        disabled={actionLoading}
                                        className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 font-medium transition"
                                    >
                                        {actionLoading ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />} Duyệt bài
                                    </button>
                                    <button
                                        onClick={() => confirmReject(blog)}
                                        disabled={actionLoading}
                                        className="px-6 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 flex items-center gap-2 font-medium transition"
                                    >
                                        <Ban size={18} /> Từ chối
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => confirmDelete(blog)}
                                disabled={actionLoading}
                                className="ml-auto px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 font-medium transition"
                            >
                                {actionLoading ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />} Xóa vĩnh viễn
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={`min-h-screen transition-colors ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto p-6">
                <div className="mb-8">
                    <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Quản lý Blog
                    </h1>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                        Duyệt và quản lý bài viết từ cộng đồng
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className={`rounded-2xl p-6 mb-8 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border'}`}>
                    <div className="flex flex-wrap gap-3">
                        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-5 py-3 rounded-xl font-medium text-sm transition-all ${filterStatus === status
                                    ? 'bg-blue-600 text-white'
                                    : theme === 'dark'
                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {status === 'ALL' && `Tất cả (${blogs.length})`}
                                {status === 'PENDING' && `Chờ duyệt (${blogs.filter(b => b.status === 'PENDING').length})`}
                                {status === 'APPROVED' && `Đã duyệt (${blogs.filter(b => b.status === 'APPROVED').length})`}
                                {status === 'REJECTED' && `Từ chối (${blogs.filter(b => b.status === 'REJECTED').length})`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Danh sách */}
                {loading ? (
                    <div className="flex justify-center py-32">
                        <Loader2 className={`w-12 h-12 animate-spin ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className={`text-center py-32 rounded-2xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <p className={`text-2xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Không có bài viết nào</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredBlogs.map(blog => (
                            <div
                                key={blog.id}
                                className={`rounded-2xl overflow-hidden border-2 transition-all ${theme === 'dark'
                                    ? 'bg-gray-800 border-gray-700 hover:border-gray-500'
                                    : 'bg-white border-gray-200 hover:border-gray-400'
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row">
                                    <img src={blog.thumbnail} alt={blog.title} className="md:w-80 h-56 md:h-auto object-cover" />
                                    <div className="p-6 md:p-8 flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} line-clamp-2`}>
                                                {blog.title}
                                            </h3>
                                            {getStatusBadge(blog.status)}
                                        </div>

                                        <p className={`mb-5 line-clamp-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {blog.content}
                                        </p>

                                        <div className={`flex flex-wrap gap-6 text-sm mb-6 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                            <span className="flex items-center gap-2"><User size={16} /> {blog.authorName}</span>
                                            <span className="flex items-center gap-2"><Calendar size={16} /> {formatDate(blog.createdAt)}</span>
                                            <span className="flex items-center gap-2"><Eye size={16} /> {blog.views} lượt xem</span>
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                onClick={() => { setSelectedBlog(blog); setShowDetailModal(true); }}
                                                className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition"
                                            >
                                                Xem chi tiết
                                            </button>
                                            {blog.status === 'PENDING' && (
                                                <>
                                                    <button onClick={() => confirmApprove(blog)} className="px-5 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition">
                                                        Duyệt
                                                    </button>
                                                    <button onClick={() => confirmReject(blog)} className="px-5 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 font-medium transition">
                                                        Từ chối
                                                    </button>
                                                </>
                                            )}
                                            <button onClick={() => confirmDelete(blog)} className="px-5 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition">
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal chi tiết */}
            {showDetailModal && (
                <BlogDetailModal
                    blog={selectedBlog}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedBlog(null);
                    }}
                />
            )}
        </div>
    );
};

export default AdminBlogManagement;