import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle, Send, User, X, Search,
    ChevronLeft, ChevronRight,
    Loader2, RefreshCw, Calendar, Phone, Mail
} from 'lucide-react';
import { format } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { axiosInstance } from '../../services/bookingService';
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs.min.js";
import { useTheme } from '../../context/ThemeContext';

// ─────────────────────────────────────────────────────────────────────────────
// 1. Types
// ─────────────────────────────────────────────────────────────────────────────
interface Conversation {
    id: number;
    userId: number | null;
    guestName: string | null;
    guestEmail: string | null;
    guestPhone: string | null;
    subject: string;
    status: 'OPEN' | 'CLOSED';
    createdAt: string;
    messages: Message[];
}

interface Message {
    id: number;
    conversationId: number;
    senderId: number | null;
    senderName: string;
    fromGuest: boolean;
    content: string;
    createdAt: string;
    read: boolean; // Đã đổi từ isRead → read
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Main Component
// ─────────────────────────────────────────────────────────────────────────────
const SupportDashboard: React.FC = () => {
    const { theme } = useTheme();
    const chatEndRef = useRef<HTMLDivElement>(null); // Auto scroll

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // ─────────────────────────────────────────────────────────────────────────
    // 3. Fetch all conversations (initial load)
    // ─────────────────────────────────────────────────────────────────────────
    const fetchConversations = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get<Conversation[]>('/support/conversations');
            const sorted = res.data.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setConversations(sorted);
            setTotalPages(Math.ceil(sorted.length / 10));
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Lỗi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    // ─────────────────────────────────────────────────────────────────────────
    // 4. REALTIME: /topic/support (Dashboard updates: new ticket, status, list)
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws-support");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 3000,
        });

        client.onConnect = () => {
            console.log("Dashboard WebSocket connected: /topic/support");
            client.subscribe('/topic/support', (msg) => {
                const updatedConv: Conversation = JSON.parse(msg.body);

                setConversations(prev => {
                    const index = prev.findIndex(c => c.id === updatedConv.id);
                    if (index === -1) {
                        // Ticket mới
                        toast.info(`Ticket mới: ${updatedConv.subject}`);
                        return [updatedConv, ...prev];
                    } else {
                        // Cập nhật ticket cũ → giữ thứ tự, chỉ cập nhật messages + status
                        const updated = [...prev];
                        updated[index] = {
                            ...updated[index],
                            status: updatedConv.status,
                            messages: updatedConv.messages
                        };
                        return updated;
                    }
                });
            });
        };

        client.activate();
        return () => { client.deactivate(); };
    }, []);

    // ─────────────────────────────────────────────────────────────────────────
    // 5. REALTIME: /topic/conversation/{id} (chat room)
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!selectedConv) return;

        const socket = new SockJS("http://localhost:8080/ws-support");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 3000,
        });

        client.onConnect = () => {
            console.log(`Chat WebSocket connected: /topic/conversation/${selectedConv.id}`);
            client.subscribe(`/topic/conversation/${selectedConv.id}`, (msg) => {
                const incoming = JSON.parse(msg.body);

                // Cập nhật read status (không có content → chỉ là update read)
                if (!incoming.content) {
                    setSelectedConv(prev =>
                        prev
                            ? {
                                ...prev,
                                messages: prev.messages.map(m =>
                                    m.id === incoming.id ? { ...m, read: incoming.read } : m // ĐÃ SỬA
                                ),
                            }
                            : prev
                    );

                    setConversations(prev =>
                        prev.map(c =>
                            c.id === incoming.conversationId
                                ? {
                                    ...c,
                                    messages: c.messages.map(m =>
                                        m.id === incoming.id ? { ...m, read: incoming.read } : m // ĐÃ SỬA
                                    ),
                                }
                                : c
                        )
                    );
                    return;
                }

                // Tin nhắn mới
                const newMessage: Message = incoming;
                setSelectedConv(prev =>
                    prev ? { ...prev, messages: [...prev.messages, newMessage] } : prev
                );
                setConversations(prev =>
                    prev.map(c =>
                        c.id === newMessage.conversationId
                            ? { ...c, messages: [...c.messages, newMessage] }
                            : c
                    )
                );
            });
        };

        client.activate();
        return () => {
            try { client.forceDisconnect(); } catch (e) { console.warn("WS cleanup error", e); }
        };
    }, [selectedConv]);

    // ─────────────────────────────────────────────────────────────────────────
    // 6. Auto scroll to bottom when messages change
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedConv?.messages]);

    // ─────────────────────────────────────────────────────────────────────────
    // 7. Open conversation detail + mark unread as read
    // ─────────────────────────────────────────────────────────────────────────
    const openConversation = async (conv: Conversation) => {
        try {
            const res = await axiosInstance.get<Conversation>(`/support/conversation/${conv.id}`);
            setSelectedConv(res.data);

            // Mark all guest unread messages as read
            const unreadGuestMessages = res.data.messages.filter(m => !m.read && m.fromGuest); // ĐÃ SỬA
            unreadGuestMessages.forEach(m => {
                axiosInstance.put(`/support/read/${m.id}`).catch(() => { });
            });

            // Update UI list
            setConversations(prev =>
                prev.map(c =>
                    c.id === conv.id
                        ? {
                            ...c,
                            messages: c.messages.map(m =>
                                !m.read && m.fromGuest ? { ...m, read: true } : m // ĐÃ SỬA
                            )
                        }
                        : c
                )
            );
        } catch (error) {
            toast.error("Lỗi tải chi tiết");
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // 8. Send reply
    // ─────────────────────────────────────────────────────────────────────────
    const sendReply = async () => {
        if (!selectedConv || !replyText.trim()) return;
        setSending(true);
        try {
            const payload = { content: replyText.trim() };
            await axiosInstance.post(`/support/reply/${selectedConv.id}`, payload);
            setReplyText('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gửi thất bại');
        } finally {
            setSending(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // 9. Close ticket
    // ─────────────────────────────────────────────────────────────────────────
    const closeTicket = async () => {
        if (!selectedConv) return;
        try {
            const res = await axiosInstance.put<Conversation>(`/support/close/${selectedConv.id}`);
            setSelectedConv(res.data);
            setConversations(prev =>
                prev.map(c => c.id === res.data.id ? res.data : c)
            );
            toast.success('Đã đóng ticket');
        } catch (error: any) {
            toast.error('Đóng thất bại');
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // 10. Filter & Search & Pagination
    // ─────────────────────────────────────────────────────────────────────────
    const filteredConversations = conversations.filter(conv => {
        const matchesSearch =
            conv.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            conv.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            conv.guestEmail?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'ALL' || conv.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const paginated = filteredConversations.slice(page * 10, (page + 1) * 10);

    // ─────────────────────────────────────────────────────────────────────────
    // 11. UI Styles (Dark Mode Support)
    // ─────────────────────────────────────────────────────────────────────────
    const bgMain = theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-700' : 'bg-slate-50';
    const bgCard = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200';
    const textPrimary = theme === 'dark' ? 'text-gray-100' : 'text-slate-900';
    const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-slate-600';
    const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-slate-500';
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-slate-200';
    const inputBg = theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-slate-300';
    const hoverBg = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-slate-50';
    const selectedBg = theme === 'dark' ? 'bg-cyan-900/30' : 'bg-cyan-50';
    const btnPrimary = 'bg-cyan-600 hover:bg-cyan-700 text-white';
    const btnDanger = 'bg-red-600 hover:bg-red-700 text-white';

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} theme={theme} className="z-50" />

            <div className={`min-h-screen ${bgMain}`}>
                {/* Header */}
                <div className={`${bgCard} border-b ${borderColor} px-6 py-4`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <MessageCircle className={`w-8 h-8 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
                            <h1 className={`text-2xl font-bold ${textPrimary}`}>Hỗ Trợ Khách Hàng</h1>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${theme === 'dark' ? 'bg-cyan-900/50 text-cyan-300' : 'bg-cyan-100 text-cyan-700'
                                }`}>
                                {conversations.filter(c => c.status === 'OPEN').length} đang mở
                            </span>
                        </div>
                        <button
                            onClick={fetchConversations}
                            className={`flex items-center gap-2 px-4 py-2 ${btnPrimary} rounded-lg transition`}
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Làm mới
                        </button>
                    </div>
                </div>

                <div className="flex h-[calc(100vh-73px)]">
                    {/* Sidebar - Danh sách ticket */}
                    <div className={`w-96 ${bgCard} border-r ${borderColor} flex flex-col`}>
                        {/* Search & Filter */}
                        <div className={`p-4 border-b ${borderColor} space-y-3`}>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm theo tên, email, chủ đề..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${inputBg}`}
                                />
                            </div>
                            <select
                                value={filterStatus}
                                onChange={e => setFilterStatus(e.target.value as any)}
                                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${inputBg}`}
                            >
                                <option value="ALL">Tất cả</option>
                                <option value="OPEN">Đang mở</option>
                                <option value="CLOSED">Đã đóng</option>
                            </select>
                        </div>

                        {/* Ticket List */}
                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center justify-center h-32">
                                    <Loader2 className={`w-8 h-8 animate-spin ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
                                </div>
                            ) : paginated.length === 0 ? (
                                <p className={`text-center ${textMuted} mt-8`}>Không có ticket nào</p>
                            ) : (
                                <AnimatePresence>
                                    {paginated.map(conv => {
                                        const unreadCount = conv.messages.filter(m => !m.read && m.fromGuest).length; // ĐÃ SỬA
                                        return (
                                            <motion.div
                                                key={conv.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                onClick={() => openConversation(conv)}
                                                className={`p-4 border-b ${borderColor} cursor-pointer transition-all ${selectedConv?.id === conv.id ? selectedBg : hoverBg}`}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className={`font-semibold ${textPrimary} truncate pr-2`}>
                                                        {conv.subject}
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        {unreadCount > 0 && (
                                                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                                                {unreadCount}
                                                            </span>
                                                        )}
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${conv.status === 'OPEN'
                                                            ? theme === 'dark' ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
                                                            : theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-slate-100 text-slate-600'
                                                            }`}>
                                                            {conv.status === 'OPEN' ? 'Mở' : 'Đóng'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className={`text-sm ${textSecondary} space-y-1`}>
                                                    <p className="flex items-center gap-1">
                                                        <User className="w-3 h-3" />
                                                        {conv.guestName || conv.userId ? `User #${conv.userId}` : 'Khách vãng lai'}
                                                    </p>
                                                    <p className="flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {conv.guestEmail || '—'}
                                                    </p>
                                                    <p className={`flex items-center gap-1 ${textMuted}`}>
                                                        <Calendar className="w-3 h-3" />
                                                        {format(new Date(conv.createdAt), 'dd/MM HH:mm')}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className={`p-3 border-t ${borderColor} flex items-center justify-between`}>
                                <button
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    className={`flex items-center gap-1 px-3 py-1 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${hoverBg}`}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Trước
                                </button>
                                <span className={`text-sm ${textSecondary}`}>
                                    Trang {page + 1} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={page === totalPages - 1}
                                    className={`flex items-center gap-1 px-3 py-1 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${hoverBg}`}
                                >
                                    Sau
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Main Chat Area */}
                    <div className="flex-1 flex flex-col bg-inherit">
                        {selectedConv ? (
                            <>
                                {/* Chat Header */}
                                <div className={`${bgCard} border-b ${borderColor} px-6 py-4 flex items-center justify-between`}>
                                    <div>
                                        <h2 className={`text-xl font-bold ${textPrimary}`}>{selectedConv.subject}</h2>
                                        <div className={`flex items-center gap-4 text-sm ${textSecondary} mt-1`}>
                                            <span className="flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                {selectedConv.guestName || `User #${selectedConv.userId}`}
                                            </span>
                                            {selectedConv.guestEmail && (
                                                <span className="flex items-center gap-1">
                                                    <Mail className="w-4 h-4" />
                                                    {selectedConv.guestEmail}
                                                </span>
                                            )}
                                            {selectedConv.guestPhone && (
                                                <span className="flex items-center gap-1">
                                                    <Phone className="w-4 h-4" />
                                                    {selectedConv.guestPhone}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedConv.status === 'OPEN'
                                            ? theme === 'dark' ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
                                            : theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {selectedConv.status === 'OPEN' ? 'Đang mở' : 'Đã đóng'}
                                        </span>
                                        {selectedConv.status === 'OPEN' && (
                                            <button
                                                onClick={closeTicket}
                                                className={`px-4 py-2 ${btnDanger} rounded-lg transition text-sm`}
                                            >
                                                Đóng Ticket
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setSelectedConv(null)}
                                            className={`p-2 rounded-lg transition ${hoverBg}`}
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    <AnimatePresence>
                                        {selectedConv.messages.map((msg, idx) => (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className={`flex ${msg.fromGuest ? 'justify-start' : 'justify-end'}`}
                                            >
                                                <div className={`max-w-md rounded-2xl px-4 py-3 
        ${msg.fromGuest ? `${bgCard} border ${borderColor}` : 'bg-cyan-600 text-white'}`}
                                                >
                                                    <p className="text-sm font-medium mb-1">
                                                        {msg.senderName}
                                                    </p>

                                                    <p className={msg.fromGuest ? textPrimary : 'text-white'}>
                                                        {msg.content}
                                                    </p>

                                                    <p className={`text-xs mt-2 flex items-center gap-1 
            ${msg.fromGuest ? textMuted : 'text-cyan-100'}`}
                                                    >
                                                        {format(new Date(msg.createdAt), 'HH:mm dd/MM')}
                                                        {msg.read && !msg.fromGuest && ( // ĐÃ SỬA
                                                            <span className="text-cyan-300">Seen</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </motion.div>

                                        ))}
                                    </AnimatePresence>
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Reply Box */}
                                {selectedConv.status === 'OPEN' && (
                                    <div className={`${bgCard} border-t ${borderColor} p-4`}>
                                        <div className="flex gap-3">
                                            <textarea
                                                value={replyText}
                                                onChange={e => setReplyText(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendReply())}
                                                placeholder="Nhập phản hồi..."
                                                rows={3}
                                                className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none ${inputBg}`}
                                            />
                                            <button
                                                onClick={sendReply}
                                                disabled={sending || !replyText.trim()}
                                                className={`self-end px-5 py-3 ${btnPrimary} rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                                            >
                                                {sending ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <Send className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <MessageCircle className={`w-16 h-16 ${textMuted} mx-auto mb-4`} />
                                    <p className={textMuted}>Chọn một ticket để xem chi tiết</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SupportDashboard;