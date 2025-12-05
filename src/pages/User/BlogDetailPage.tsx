// src/pages/User/BlogDetailPage.tsx
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Eye, MessageCircle, Clock, Calendar
} from 'lucide-react';
import {
    fetchBlogById,
    fetchBlogComments,
    fetchRelatedBlogs,
    createComment
} from '../../services/blogService';
import type { BlogDTO, BlogCommentDTO, BlogSummaryDTO } from '../../types/blogTypes';

export default function BlogDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const blogId = Number(id);

    const [blog, setBlog] = useState<BlogDTO | null>(null);
    const [comments, setComments] = useState<BlogCommentDTO[]>([]);
    const [relatedBlogs, setRelatedBlogs] = useState<BlogSummaryDTO[]>([]);
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState(true);

    // Thay toàn bộ useEffect hiện tại bằng đoạn này
    useEffect(() => {
        if (!blogId) {
            navigate('/blog');
            return;
        }

        // Dùng IIFE (Immediately Invoked Function Expression) để có async/await
        void (async () => {
            try {
                setLoading(true);

                const [blogData, commentsData, relatedData] = await Promise.all([
                    fetchBlogById(blogId),
                    fetchBlogComments(blogId),
                    fetchRelatedBlogs(blogId)
                ]);

                setBlog(blogData);
                setComments(commentsData);
                setRelatedBlogs(relatedData);
            } catch (err) {
                toast.error('Không tải được bài viết');
                navigate('/blog');
            } finally {
                setLoading(false);
            }
        })();
    }, [blogId, navigate]); // thêm navigate vào dependency cho chắc chắn

    const handleAddComment = async () => {
        if (!commentText.trim()) return;
        try {
            const newComment = await createComment(blogId, commentText);
            setComments(prev => [newComment, ...prev]);
            setCommentText('');
            toast.success('Bình luận đã gửi, đang chờ duyệt');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Gửi bình luận thất bại');
        }
    };

    const formatDate = (date: string) => new Date(date).toLocaleDateString('vi-VN');

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!blog) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="relative h-screen max-h-[700px] overflow-hidden">
                <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
                    <h1 className="text-4xl md:text-6xl font-bold max-w-5xl leading-tight drop-shadow-2xl">
                        {blog.title}
                    </h1>
                    <div className="mt-8 flex flex-wrap gap-6 text-lg">
                        <span className="flex items-center gap-2"><Eye size={24} /> {blog.views.toLocaleString()}</span>
                        <span className="flex items-center gap-2"><MessageCircle size={24} /> {comments.length}</span>
                        <span className="flex items-center gap-2"><Calendar size={24} /> {formatDate(blog.createdAt)}</span>
                    </div>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-8 left-8 bg-white/95 px-6 py-3 rounded-full shadow-xl hover:shadow-2xl font-bold text-cyan-600 flex items-center gap-2"
                >
                    <ArrowLeft size={24} /> Quay lại
                </button>
            </div>

            {/* Nội dung */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-3 gap-10">
                    <article className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
                        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br>') }} />

                        {blog.images.length > 0 && (
                            <div className="grid grid-cols-2 gap-4 my-10">
                                {blog.images.map((img, i) => (
                                    <img key={i} src={img} alt="" className="rounded-xl shadow-md hover:scale-105 transition" />
                                ))}
                            </div>
                        )}

                        {/* Bình luận */}
                        <div className="mt-12">
                            <h3 className="text-2xl font-bold mb-6">Bình luận ({comments.length})</h3>
                            <textarea
                                value={commentText}
                                onChange={e => setCommentText(e.target.value)}
                                placeholder="Viết bình luận của bạn..."
                                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                                rows={4}
                            />
                            <button
                                onClick={handleAddComment}
                                className="mt-3 bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 font-bold"
                            >
                                Gửi bình luận
                            </button>

                            <div className="mt-8 space-y-6">
                                {comments.map(c => (
                                    <div key={c.id} className="flex gap-4 bg-gray-50 p-5 rounded-lg">
                                        <img src={c.userAvatarUrl || 'https://i.pravatar.cc/150?u=' + c.username} className="w-12 h-12 rounded-full" />
                                        <div>
                                            <p className="font-bold">{c.username}</p>
                                            <p className="text-gray-700 mt-1">{c.content}</p>
                                            <p className="text-sm text-gray-500 mt-2">{formatDate(c.createdAt)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Clock size={20} /> Bài viết liên quan
                            </h3>
                            {relatedBlogs.map(b => (
                                <div key={b.id} onClick={() => navigate(`/blog/${b.id}`)} className="flex gap-4 mb-4 cursor-pointer group">
                                    <img src={b.thumbnail} className="w-24 h-24 rounded-lg object-cover group-hover:scale-105 transition" />
                                    <div>
                                        <h4 className="font-semibold group-hover:text-cyan-600">{b.title}</h4>
                                        <p className="text-sm text-gray-500">{formatDate(b.createdAt)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}