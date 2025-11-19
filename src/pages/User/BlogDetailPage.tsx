import { useState, useEffect } from 'react';
import {
    ArrowLeft, Eye, MessageCircle, ThumbsUp, Share2,
    Plus, X, Upload, Image as ImageIcon, Send, Clock, Calendar
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// ==================== MOCK DATA ====================
const mockBlogs = [
    {
        id: 1,
        title: "Khám phá vẻ đẹp Vịnh Hạ Long - Di sản thế giới UNESCO",
        content: `Vịnh Hạ Long là một trong những kỳ quan thiên nhiên tuyệt đẹp nhất của Việt Nam và được UNESCO công nhận là Di sản Thiên nhiên Thế giới...\n\n## Vẻ đẹp huyền bí của những đảo đá\nVịnh Hạ Long có hơn 1.600 hòn đảo lớn nhỏ...\n\n### Hang Đầu Gỗ\nĐây là hang động lớn nhất vịnh Hạ Long với hệ thống nhũ đá kỳ vĩ...\n\n### Hang Sửng Sốt\nNằm trên đảo Bồ Hòn, được mệnh danh là "động tiên"\n\n## Trải nghiệm du lịch tuyệt vời\n### Tàu du lịch qua đêm\nTrải nghiệm ngủ trên vịnh là điều không thể bỏ qua\n### Chèo kayak khám phá vịnh\nLen lỏi qua các khe núi, hang động nhỏ\n\n## Ẩm thực Vịnh Hạ Long\n- Chả mực Hạ Long giòn tan\n- Ngao nướng mỡ hành thơm lừng\n- Sò điệp nướng phô mai béo ngậy\n- Bánh cuốn chả mực đặc sản`,
        excerpt: "Hành trình khám phá kỳ quan thiên nhiên với hơn 1.600 đảo đá vôi hùng vĩ...",
        thumbnail: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1600",
        author: { name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/150?img=1" },
        createdAt: "2024-11-15T10:00:00",
        views: 1234,
        commentCount: 15,
        images: [
            "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200",
            "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200",
            "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200",
            "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=1200"
        ],
        tags: ["Hạ Long", "Du lịch biển", "UNESCO", "Việt Nam", "Kỳ quan"]
    },
    // ... các bài còn lại giữ nguyên
    {
        id: 2,
        title: "Sapa mùa lúa chín - Thiên đường nơi hạ giới",
        excerpt: "Những thửa ruộng bậc thang vàng óng ánh dưới nắng thu Sapa...",
        thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        author: { name: "Trần Thị B", avatar: "https://i.pravatar.cc/150?img=2" },
        createdAt: "2024-11-10T14:30:00",
        views: 2890,
        commentCount: 32,
        tags: ["Sapa", "Du lịch núi", "Lúa chín", "Việt Nam"]
    },
    {
        id: 3,
        title: "Phú Quốc 3 ngày 2 đêm - Lịch trình chi tiết",
        excerpt: "Kinh nghiệm ăn chơi, đi lại, nghỉ dưỡng tại đảo ngọc...",
        thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
        author: { name: "Lê Văn C", avatar: "https://i.pravatar.cc/150?img=3" },
        createdAt: "2024-11-08T09:20:00",
        views: 5670,
        commentCount: 48,
        tags: ["Phú Quốc", "Du lịch biển", "Đảo", "Việt Nam"]
    },
    {
        id: 4,
        title: "Ninh Bình - Vịnh Hạ Long trên cạn",
        excerpt: "Tràng An, Tam Cốc, Hang Múa - những điểm đến không thể bỏ qua...",
        thumbnail: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800",
        author: { name: "Phạm Thị D", avatar: "https://i.pravatar.cc/150?img=4" },
        createdAt: "2024-11-05T11:15:00",
        views: 4120,
        commentCount: 29,
        tags: ["Ninh Bình", "Tràng An", "Du lịch văn hóa", "Việt Nam"]
    }
];

// Tìm bài liên quan
function getRelatedBlogs(current: any, all: any[], limit = 3) {
    const scored = all
        .filter(b => b.id !== current.id)
        .map(b => ({
            blog: b,
            score: b.tags.filter((t: string) => current.tags.includes(t)).length
        }))
        .filter(i => i.score > 0)
        .sort((a, b) => b.score - a.score || new Date(b.blog.createdAt).getTime() - new Date(a.blog.createdAt).getTime())
        .slice(0, limit)
        .map(i => i.blog);

    if (scored.length < limit) {
        const more = all.filter(b => !scored.find(r => r.id === b.id) && b.id !== current.id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, limit - scored.length);
        scored.push(...more);
    }
    return scored;
}

export default function BlogDetail() {
    const { id } = useParams<{ id: string }>();
    const blogId = Number(id);
    const navigate = useNavigate();

    const [blog, setBlog] = useState<any>(null);
    const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);
    const [comments, setComments] = useState<any[]>([]);
    const [commentText, setCommentText] = useState('');
    const [liked, setLiked] = useState(false);

    // Modal viết bài mới
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newThumbnail, setNewThumbnail] = useState('');
    const [galleryImages, setGalleryImages] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!id || isNaN(blogId)) {
                navigate('/blog');
                return;
            }
            const found = mockBlogs.find(b => b.id === blogId);
            if (found) {
                setBlog(found);
                setRelatedBlogs(getRelatedBlogs(found, mockBlogs));
            } else {
                navigate('/blog');
            }
        };
        fetchData();
    }, [blogId, id, navigate]);

    const formatDate = (date: string) => new Date(date).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const handleCreateBlog = () => {
        if (!newTitle.trim() || !newContent.trim()) return alert("Vui lòng nhập đủ tiêu đề và nội dung!");
        alert("Đăng bài thành công! (mock)");
        setIsModalOpen(false);
        setNewTitle('');
        setNewContent('');
        setNewThumbnail('');
        setGalleryImages([]);
    };

    if (!blog) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">

                {/* HERO ẢNH BÀI BLOG - CHỈ ẢNH THÔI, TO NHẤT CÓ THỂ */}
                <div className="relative h-screen max-h-[600px] md:max-h-[700px] lg:max-h-[800px] overflow-hidden">
                    {/* Ảnh chính */}
                    <img
                        src={blog.thumbnail}
                        alt={blog.title}
                        className="w-full h-full object-cover brightness-90"
                        onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/1920x1080?text=Blog+Image'}
                    />

                    {/* Gradient đen đè lên cho chữ trắng nổi bật */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* Tiêu đề + info ngắn gọn nằm dưới cùng */}
                    <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 lg:px-24 pb-10 md:pb-16">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight max-w-5xl drop-shadow-2xl">
                            {blog.title}
                        </h1>

                        <div className="mt-6 flex flex-wrap items-center gap-6 text-white/90 text-lg">
                            <span className="flex items-center gap-2">
                                <Eye size={24} /> {blog.views.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-2">
                                <MessageCircle size={24} /> {blog.commentCount}
                            </span>
                            <span className="flex items-center gap-2">
                                <Calendar size={24} /> {formatDate(blog.createdAt)}
                            </span>
                        </div>
                    </div>

                    {/* Nút back nhỏ gọn */}
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-6 left-6 z-50 flex items-center gap-2 bg-white/95 px-5 py-3 rounded-full shadow-xl hover:shadow-2xl transition font-bold text-cyan-600"
                    >
                        <ArrowLeft size={22} />
                        Quay lại
                    </button>
                </div>

                {/* Main Content */}
                <div className="px-4 md:px-6 py-6 md:py-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
                            {/* Nội dung chính */}
                            <article className="lg:col-span-2">
                                <div className="bg-white rounded-xl shadow-md p-5 md:p-8">
                                    {/* Author */}
                                    <div className="flex items-center gap-3 mb-6 pb-5 border-b">
                                        <img src={blog.author.avatar} alt={blog.author.name} className="w-14 h-14 rounded-full ring-3 ring-cyan-100" />
                                        <div>
                                            <p className="font-bold text-lg">{blog.author.name}</p>
                                            <p className="text-gray-600 text-sm">Đăng ngày {formatDate(blog.createdAt)}</p>
                                        </div>
                                    </div>

                                    {/* Nội dung bài viết */}
                                    <div className="prose prose-base max-w-none text-gray-700 space-y-5">
                                        {blog.content.split('\n').map((line: string, i: number) => {
                                            if (line.startsWith('## ')) return <h2 key={i} className="text-2xl md:text-3xl font-bold mt-10 mb-4 text-gray-900">{line.replace('## ', '')}</h2>;
                                            if (line.startsWith('### ')) return <h3 key={i} className="text-xl md:text-2xl font-bold mt-8 mb-3 text-gray-800">{line.replace('### ', '')}</h3>;
                                            if (line.startsWith('- ')) return <li key={i} className="ml-5 text-base leading-relaxed">{line.replace('- ', '')}</li>;
                                            if (!line.trim()) return null;
                                            return <p key={i} className="text-base leading-relaxed">{line}</p>;
                                        })}
                                    </div>

                                    {/* Gallery */}
                                    {blog.images && blog.images.length > 0 && (
                                        <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {blog.images.map((img: string, i: number) => (
                                                <img key={i} src={img} alt={`Hình ${i + 1}`} className="rounded-lg object-cover h-56 md:h-64 w-full shadow-md hover:scale-[1.02] transition-transform" />
                                            ))}
                                        </div>
                                    )}

                                    {/* Like & Share */}
                                    <div className="flex flex-wrap gap-3 py-5 border-t mt-6">
                                        <button
                                            onClick={() => setLiked(!liked)}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${liked ? 'bg-cyan-600 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'}`}
                                        >
                                            <ThumbsUp size={18} /> Thích
                                        </button>
                                        <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 rounded-lg font-medium text-sm hover:bg-gray-200 transition-all">
                                            <Share2 size={18} /> Chia sẻ
                                        </button>
                                    </div>

                                    {/* Bình luận */}
                                    <div className="mt-10">
                                        <h3 className="text-xl md:text-2xl font-bold mb-5">Bình luận ({comments.length})</h3>
                                        <textarea
                                            value={commentText}
                                            onChange={e => setCommentText(e.target.value)}
                                            placeholder="Viết bình luận của bạn..."
                                            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none resize-none text-sm md:text-base"
                                            rows={4}
                                        />
                                        <button
                                            onClick={() => {
                                                if (!commentText.trim()) return;
                                                setComments(prev => [...prev, {
                                                    id: Date.now(),
                                                    content: commentText,
                                                    author: { name: "Bạn", avatar: "https://i.pravatar.cc/150?u=me" },
                                                    createdAt: new Date().toISOString()
                                                }]);
                                                setCommentText('');
                                            }}
                                            className="mt-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-6 py-2.5 rounded-lg hover:from-cyan-700 hover:to-cyan-800 font-semibold text-sm transition-all flex items-center gap-2 shadow-md"
                                        >
                                            <Send size={18} /> Gửi bình luận
                                        </button>

                                        <div className="mt-8 space-y-5">
                                            {comments.map((c: any) => (
                                                <div key={c.id} className="flex gap-3">
                                                    <img src={c.author.avatar} alt={c.author.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                                                    <div className="flex-1 bg-gray-50 rounded-lg p-4">
                                                        <p className="font-bold text-sm">{c.author.name}</p>
                                                        <p className="text-gray-700 mt-1 text-sm">{c.content}</p>
                                                        <p className="text-xs text-gray-500 mt-2">{formatDate(c.createdAt)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </article>

                            {/* Sidebar */}
                            <aside className="lg:col-span-1 space-y-6">
                                {/* Tags */}
                                <div className="bg-white rounded-xl shadow-md p-5 lg:sticky lg:top-20">
                                    <h3 className="font-bold text-lg mb-4">Từ khóa</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {blog.tags.map((tag: string) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-sm font-medium hover:bg-cyan-100 transition cursor-pointer"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Bài viết liên quan */}
                                <div className="bg-white rounded-xl shadow-md p-5">
                                    <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                                        <Clock size={20} className="text-cyan-600" /> Bài viết liên quan
                                    </h3>
                                    <div className="space-y-4">
                                        {relatedBlogs.map((b: any) => (
                                            <Link key={b.id} to={`/blog/${b.id}`} className="block group">
                                                <div className="flex gap-3">
                                                    <img
                                                        src={b.thumbnail}
                                                        alt={b.title}
                                                        className="w-20 h-20 rounded-lg object-cover group-hover:scale-105 transition flex-shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-sm line-clamp-2 group-hover:text-cyan-600 transition">
                                                            {b.title}
                                                        </h4>
                                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <Eye size={12} /> {b.views.toLocaleString()}
                                                            </span>
                                                            <span>{formatDate(b.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>

                {/* FAB Viết bài mới */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="fixed bottom-8 left-8 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white w-16 h-16 rounded-full shadow-2xl hover:scale-110 transition flex items-center justify-center z-50"
                >
                    <Plus size={28} />
                </button>

                {/* MODAL ĐĂNG BÀI MỚI */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 md:p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Viết bài mới</h2>
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            setNewTitle(''); setNewContent(''); setNewThumbnail(''); setGalleryImages([]);
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-5">
                                    {/* Tiêu đề */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Tiêu đề bài viết <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={newTitle}
                                            onChange={e => setNewTitle(e.target.value)}
                                            placeholder="Nhập tiêu đề hấp dẫn..."
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm md:text-base"
                                        />
                                    </div>

                                    {/* Ảnh bìa */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Ảnh bìa (tùy chọn)</label>
                                        <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-cyan-500 transition cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={e => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => setNewThumbnail(reader.result as string);
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                            {newThumbnail ? (
                                                <div className="space-y-3">
                                                    <img src={newThumbnail} alt="Preview" className="mx-auto max-h-48 rounded-lg object-cover shadow-md" />
                                                    <p className="text-cyan-600 text-sm font-medium">Nhấp để thay ảnh</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <Upload size={32} className="mx-auto text-gray-400" />
                                                    <p className="text-gray-700 font-medium text-sm">Chọn ảnh bìa</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Ảnh phụ */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Ảnh phụ (tối đa 20 ảnh)</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
                                            <div className="flex items-center justify-center mb-4">
                                                <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition text-sm font-medium">
                                                    <Upload size={18} /> Thêm ảnh
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        className="hidden"
                                                        onChange={e => {
                                                            const files = e.target.files;
                                                            if (!files) return;
                                                            const newPreviews: string[] = [];
                                                            let processed = 0;
                                                            Array.from(files).forEach(file => {
                                                                if (galleryImages.length + processed >= 20) return alert("Tối đa 20 ảnh!");
                                                                if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) return;
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
                                                <span className="ml-3 text-sm text-gray-600">{galleryImages.length}/20</span>
                                            </div>

                                            {galleryImages.length > 0 ? (
                                                <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                                                    {galleryImages.map((src, i) => (
                                                        <div key={i} className="relative group rounded-lg overflow-hidden shadow-sm">
                                                            <img src={src} alt="" className="w-full h-20 object-cover" />
                                                            <button
                                                                onClick={() => setGalleryImages(prev => prev.filter((_, idx) => idx !== i))}
                                                                className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-6 text-gray-400">
                                                    <ImageIcon size={36} className="mx-auto mb-2" />
                                                    <p className="text-sm">Chưa có ảnh nào</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Nội dung */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Nội dung <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={newContent}
                                            onChange={e => setNewContent(e.target.value)}
                                            rows={10}
                                            placeholder="Chia sẻ hành trình của bạn..."
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none text-sm md:text-base"
                                        />
                                    </div>

                                    {/* Nút */}
                                    <div className="flex gap-3 pt-4 border-t">
                                        <button
                                            onClick={handleCreateBlog}
                                            disabled={!newTitle.trim() || !newContent.trim()}
                                            className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white py-3 rounded-lg font-semibold hover:from-cyan-700 hover:to-cyan-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                                        >
                                            <Send size={20} /> Đăng bài
                                        </button>
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition text-sm md:text-base"
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