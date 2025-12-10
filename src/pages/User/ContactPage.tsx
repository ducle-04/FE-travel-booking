import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Phone, Mail, Clock, Send, Facebook, Youtube,
    MessageCircle, Globe, CheckCircle, Loader2,
    X, Search, ChevronLeft, ChevronRight, AlertCircle,
    Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { axiosInstance } from '../../services/bookingService';

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs.min.js";

// ─────────────────────────────────────────────────────────────────────────────
// 1. Types
// ─────────────────────────────────────────────────────────────────────────────
interface SendMessageRequest {
    subject: string;
    content: string;
    guestName?: string;
    guestEmail?: string;
    guestPhone?: string;
}

interface Conversation {
    id: number;
    subject: string;
    status: 'OPEN' | 'CLOSED';
    createdAt: string;
    messages: Message[];
}

interface Message {
    id: number;
    senderId: number | null;
    senderName: string;
    fromGuest: boolean;
    content: string;
    createdAt: string;
    isRead: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Main Component
// ─────────────────────────────────────────────────────────────────────────────
const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', subject: '', message: ''
    });
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Modal states
    const [showTickets, setShowTickets] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
    const [ticketLoading, setTicketLoading] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [sendingReply, setSendingReply] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    // ─────────────────────────────────────────────────────────────────────────
    // 3. Kiểm tra login + lấy user info
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        const token = sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');
        if (token) {
            setIsLoggedIn(true);
            axiosInstance.get('/user/profile')
                .then(res => {
                    const user = res.data;
                    setCurrentUserId(user.id);
                    setFormData(prev => ({
                        ...prev,
                        name: user.fullname || '',
                        email: user.email || '',
                        phone: user.phoneNumber || ''
                    }));
                })
                .catch(() => setIsLoggedIn(false));
        }
    }, []);

    // ─────────────────────────────────────────────────────────────────────────
    // 4. Mở modal + fetch tickets
    // ─────────────────────────────────────────────────────────────────────────
    const openTicketsModal = async () => {
        if (!isLoggedIn) {
            window.location.href = '/login';
            return;
        }

        setShowTickets(true);
        setTicketLoading(true);

        try {
            const res = await axiosInstance.get<Conversation[]>('/support/my-conversations');
            const sorted = res.data.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setConversations(sorted);
            setTotalPages(Math.ceil(sorted.length / 10));
        } catch {
            toast.error('Lỗi tải lịch sử liên hệ');
        } finally {
            setTicketLoading(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // 5. WebSocket Realtime (messages + CLOSED)
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!selectedConv) return;

        const socket = new SockJS("http://localhost:8080/ws-support");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 3000,
        });

        client.onConnect = () => {
            console.log("User WebSocket connected");

            client.subscribe(`/topic/conversation/${selectedConv.id}`, (msg) => {
                const data = JSON.parse(msg.body);

                // 🟥 Nếu là update conversation (VD: CLOSED)
                if (data.status) {
                    // update bản đang mở
                    setSelectedConv(prev =>
                        prev ? { ...prev, status: data.status } : prev
                    );

                    // 🟩 UPDATE LIST BÊN TRÁI (fix lỗi list vẫn hiện "Mở")
                    setConversations(prev =>
                        prev.map(c =>
                            c.id === data.id ? { ...c, status: data.status } : c
                        )
                    );

                    return;
                }

                // 🟦 Nếu là message mới
                setSelectedConv(prev =>
                    prev ? { ...prev, messages: [...prev.messages, data] } : prev
                );
            });

        };

        client.activate();

        return () => {
            client.deactivate();
        };

    }, [selectedConv]);

    // ─────────────────────────────────────────────────────────────────────────
    // 6. Open conversation
    // ─────────────────────────────────────────────────────────────────────────
    const openConversation = (conv: Conversation) => {
        // Clone để không làm mutate list gốc
        setSelectedConv({ ...conv });
    };

    // ─────────────────────────────────────────────────────────────────────────
    // 7. Reply tin nhắn
    // ─────────────────────────────────────────────────────────────────────────
    const sendReply = async () => {
        if (!selectedConv) return;
        if (!replyText.trim()) return;

        // 🚨 Chặn gửi nếu CLOSED
        if (selectedConv.status === 'CLOSED') {
            toast.error("Ticket đã đóng, không thể gửi thêm.");
            return;
        }

        setSendingReply(true);

        try {
            await axiosInstance.post(
                `/support/reply/${selectedConv.id}`,
                { content: replyText.trim() }
            );
            setReplyText('');
        } catch {
            toast.error('Gửi thất bại');
        } finally {
            setSendingReply(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // 8. Submit tạo ticket
    // ─────────────────────────────────────────────────────────────────────────
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc');
            return;
        }

        setLoading(true);

        const payload: SendMessageRequest = {
            subject: formData.subject || 'Liên hệ từ khách hàng',
            content: formData.message,
            ...(isLoggedIn ? {} : {
                guestName: formData.name,
                guestEmail: formData.email,
                guestPhone: formData.phone || undefined
            })
        };

        try {
            await axiosInstance.post('/support/contact', payload);
            toast.success('Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm.');
            setSent(true);
            setFormData({ ...formData, message: '', subject: '' });
            setTimeout(() => setSent(false), 5000);
        } catch {
            toast.error('Gửi thất bại');
        } finally {
            setLoading(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // 9. Filter + Pagination
    // ─────────────────────────────────────────────────────────────────────────
    const filtered = conversations.filter(c =>
        c.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const paginated = filtered.slice(page * 10, (page + 1) * 10);

    // ─────────────────────────────────────────────────────────────────────────
    // 10. UI
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <>
            <ToastContainer position="top-right" autoClose={4000} />

            {/* Modal History */}
            <AnimatePresence>
                {showTickets && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowTickets(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <MessageCircle className="w-8 h-8 text-cyan-600" />
                                    Lịch Sử Liên Hệ
                                </h2>
                                <button
                                    onClick={() => setShowTickets(false)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 flex overflow-hidden">
                                {/* Sidebar */}
                                <div className="w-96 border-r border-slate-200 flex flex-col">
                                    <div className="p-4 border-b">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Tìm theo chủ đề..."
                                                value={searchTerm}
                                                onChange={e => setSearchTerm(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto">
                                        {ticketLoading ? (
                                            <div className="flex justify-center p-8">
                                                <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
                                            </div>
                                        ) : paginated.length === 0 ? (
                                            <p className="text-center text-slate-500 p-8">Bạn chưa có ticket nào</p>
                                        ) : (
                                            paginated.map(conv => (
                                                <div
                                                    key={conv.id}
                                                    onClick={() => openConversation(conv)}
                                                    className={`p-4 border-b cursor-pointer hover:bg-slate-50 transition ${selectedConv?.id === conv.id ? 'bg-cyan-50' : ''
                                                        }`}
                                                >
                                                    <div className="flex justify-between mb-2">
                                                        <h3 className="font-semibold truncate pr-2">{conv.subject}</h3>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${conv.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                                                            }`}>
                                                            {conv.status === 'OPEN' ? 'Mở' : 'Đóng'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-600 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {format(new Date(conv.createdAt), 'dd/MM HH:mm')}
                                                    </p>
                                                    {conv.messages.some(m => !m.isRead && !m.fromGuest) && (
                                                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" />
                                                            Có phản hồi mới
                                                        </p>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="p-3 border-t flex justify-between text-sm">
                                            <button
                                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                                disabled={page === 0}
                                                className="flex items-center gap-1 disabled:opacity-50"
                                            >
                                                <ChevronLeft className="w-4 h-4" /> Trước
                                            </button>

                                            <span>Trang {page + 1} / {totalPages}</span>

                                            <button
                                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                                disabled={page === totalPages - 1}
                                                className="flex items-center gap-1 disabled:opacity-50"
                                            >
                                                Sau <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Chat Area */}
                                <div className="flex-1 flex flex-col">
                                    {selectedConv ? (
                                        <>
                                            <div className="p-4 border-b bg-white">
                                                <h3 className="font-bold">{selectedConv.subject}</h3>
                                                <p className="text-sm text-slate-600">
                                                    {format(new Date(selectedConv.createdAt), 'dd/MM/yyyy HH:mm')}
                                                </p>
                                            </div>

                                            {/* ⛔ Hiển thị thông báo ticket bị đóng */}
                                            {selectedConv.status === 'CLOSED' && (
                                                <div className="bg-red-50 text-red-700 p-3 text-center text-sm border-b border-red-200">
                                                    Ticket đã được đóng. Bạn không thể gửi thêm tin nhắn.
                                                </div>
                                            )}

                                            {/* Messages */}
                                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                                                {selectedConv.messages.map(msg => {
                                                    const isMine = msg.senderId === currentUserId;

                                                    return (
                                                        <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                            <div className={`
                                                                max-w-xs px-4 py-2 rounded-2xl 
                                                                ${isMine ? 'bg-cyan-600 text-white' : 'bg-white border border-slate-200 text-slate-900'}
                                                            `}>
                                                                <p className="font-medium text-sm">
                                                                    {msg.senderName || (msg.fromGuest ? "Khách" : "Staff")}
                                                                </p>
                                                                <p>{msg.content}</p>
                                                                <p className={`text-xs mt-1 ${isMine ? 'text-cyan-100' : 'text-slate-500'}`}>
                                                                    {format(new Date(msg.createdAt), 'HH:mm')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Input Box */}
                                            {selectedConv.status === 'OPEN' && (
                                                <div className="p-4 border-t bg-white">
                                                    <div className="flex gap-2">
                                                        <textarea
                                                            value={replyText}
                                                            onChange={e => setReplyText(e.target.value)}
                                                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendReply())}
                                                            placeholder="Nhập phản hồi..."
                                                            rows={2}
                                                            className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                                                        />
                                                        <button
                                                            onClick={sendReply}
                                                            disabled={sendingReply || !replyText.trim()}
                                                            className="px-4 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 disabled:opacity-50 flex items-center gap-2"
                                                        >
                                                            {sendingReply ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                        </>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center text-slate-400">
                                            <MessageCircle className="w-16 h-16 mb-4" />
                                            <p>Chọn một ticket để xem chi tiết</p>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Trang chính */}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                {/* Hero */}
                <motion.div
                    className="relative bg-gradient-to-br from-cyan-600 to-blue-700 py-32 px-6 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl"></div>

                    <div className="relative max-w-7xl mx-auto text-center text-white">
                        <motion.h1
                            className="text-5xl md:text-6xl font-bold mb-6"
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Liên Hệ Với Chúng Tôi
                        </motion.h1>
                        <motion.p
                            className="text-xl md:text-2xl max-w-3xl mx-auto"
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Đội ngũ tư vấn luôn sẵn sàng hỗ trợ bạn 24/7
                        </motion.p>
                    </div>
                </motion.div>

                <div className="max-w-7xl mx-auto px-6 py-16 -mt-10 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Thông tin liên hệ */}
                        <div className="space-y-8">
                            <motion.div
                                className="bg-white rounded-2xl p-8 border border-slate-200"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                    <MessageCircle className="w-8 h-8 text-cyan-600" />
                                    Thông Tin Liên Hệ
                                </h2>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-6 h-6 text-cyan-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Địa chỉ Hà Nội</p>
                                            <p className="text-slate-600">Tầng 15, Tòa nhà Handico<br />Phạm Hùng, Mỹ Đình, Hà Nội</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Phone className="w-6 h-6 text-cyan-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Hotline 24/7</p>
                                            <p className="text-2xl font-bold text-cyan-600">1900 1234</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-6 h-6 text-cyan-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Email</p>
                                            <p className="text-cyan-600 font-medium">support@tourviet.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-6 h-6 text-cyan-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Giờ làm việc</p>
                                            <p className="text-slate-600">T2 - T6: 8:00 - 21:00<br />T7, CN: 8:00 - 20:00</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl p-8 text-white"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-xl font-bold mb-6">Kết nối với chúng tôi</h3>
                                <div className="flex gap-4">
                                    <a href="#" className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition">
                                        <Facebook className="w-6 h-6" />
                                    </a>
                                    <a href="#" className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition">
                                        <Youtube className="w-6 h-6" />
                                    </a>
                                    <a href="#" className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition">
                                        <MessageCircle className="w-6 h-6" />
                                    </a>
                                    <a href="#" className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition">
                                        <Globe className="w-6 h-6" />
                                    </a>
                                </div>
                            </motion.div>
                        </div>

                        {/* Form + Bản đồ */}
                        <div className="lg:col-span-2 space-y-8">
                            <motion.div
                                className="bg-white rounded-2xl p-8 border border-slate-200"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-3xl font-bold text-slate-900">
                                        Gửi Tin Nhắn Cho Chúng Tôi
                                    </h2>
                                    {isLoggedIn && (
                                        <button
                                            onClick={openTicketsModal}  // ← ĐÃ SỬA TÊN HÀM
                                            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition text-sm font-medium"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                            Xem lịch sử
                                        </button>
                                    )}
                                </div>

                                {sent && (
                                    <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
                                        <CheckCircle className="w-8 h-8" />
                                        <div>
                                            <p className="font-semibold">Gửi thành công!</p>
                                            <p className="text-sm">Chúng tôi sẽ phản hồi trong vòng 24h.</p>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Họ và tên *"
                                            className="w-full px-5 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                                            required
                                            disabled={isLoggedIn}
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Email *"
                                            className="w-full px-5 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                                            required
                                            disabled={isLoggedIn}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Số điện thoại"
                                            className="w-full px-5 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                                            disabled={isLoggedIn}
                                        />
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="Chủ đề"
                                            className="w-full px-5 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                                        />
                                    </div>

                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={6}
                                        placeholder="Nội dung tin nhắn *"
                                        className="w-full px-5 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition resize-none"
                                        required
                                    ></textarea>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-cyan-600 text-white py-5 rounded-xl font-semibold text-lg hover:bg-cyan-700 transition flex items-center justify-center gap-3 disabled:opacity-70"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                Đang gửi...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-6 h-6" />
                                                Gửi Tin Nhắn
                                            </>
                                        )}
                                    </button>
                                </form>
                            </motion.div>

                            {/* Bản đồ */}
                            <motion.div
                                className="bg-white rounded-2xl overflow-hidden border border-slate-200"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="p-6 border-b border-slate-200">
                                    <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                        <MapPin className="w-7 h-7 text-cyan-600" />
                                        Văn phòng Hà Nội
                                    </h3>
                                </div>
                                <div className="h-96">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096339873328!2d105.84713001531662!3d21.028811985998207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab009cd0a263%3A0x3b8d9d6a7c7b7b7b!2sHanoi%2C%20Vietnam!5e0!3m2!1sen!2svn!4v1697671234567"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <section className="bg-gradient-to-r from-cyan-600 to-blue-700 py-16 mt-20">
                    <div className="max-w-4xl mx-auto text-center text-white px-6">
                        <h2 className="text-4xl font-bold mb-6">
                            Sẵn sàng cho chuyến đi tiếp theo?
                        </h2>
                        <p className="text-xl mb-8 opacity-90">
                            Liên hệ ngay để được tư vấn tour riêng miễn phí!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="tel:19001234" className="bg-white text-cyan-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition inline-flex items-center justify-center gap-3">
                                <Phone className="w-6 h-6" />
                                Gọi ngay: 1900 1234
                            </a>
                            <a href="#form" className="bg-transparent border-2 border-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition">
                                Gửi tin nhắn
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default ContactPage;