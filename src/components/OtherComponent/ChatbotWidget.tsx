import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2, ExternalLink } from 'lucide-react';

interface Message {
    role: 'user' | 'bot';
    content: string;
}

export default function ChatbotWidget() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // ============================
    // 🔥 GỢI Ý CÂU HỎI — ALWAYS SHOW
    // ============================
    const suggestions = [
        "Gợi ý tour phù hợp cho mình 🤔",
        "Tour dưới 5 triệu 💸",
        "Sa Pa có những tour gì ? 🏝️",
        "Cuối tuần này có gì hot? 🔥",
        "Top các tour phổ biến 🏆",
        "Miền bắc có những tour nào ? ✈️",
    ];

    const handleSuggestionClick = (text: string) => {
        setInput(text);
        setTimeout(() => sendMessage(), 50);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // GỌI API LẤY LỊCH SỬ KHI MỞ CHATBOT
    const loadChatHistory = async () => {
        const token = sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');
        if (!token) {
            if (messages.length === 0) {
                setMessages([
                    {
                        role: 'bot',
                        content:
                            'Chào anh/chị! Em là trợ lý du lịch AI đây ạ! Anh/chị muốn đi đâu chơi nào? Phú Quốc, Đà Lạt, Sapa hay Hàn Quốc?'
                    }
                ]);
            }
            return;
        }

        setIsLoadingHistory(true);
        try {
            const res = await axios.get('http://localhost:8080/api/chatbot/history', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            if (res.data && res.data.length > 0) {
                const historyMessages: Message[] = res.data.map((h: any) => [
                    { role: 'user' as const, content: h.userMessage },
                    { role: 'bot' as const, content: h.botReply }
                ]).flat();

                setMessages(historyMessages);
            } else {
                setMessages([
                    {
                        role: 'bot',
                        content: 'Chào mừng anh/chị quay lại nha! Hôm nay mình đi đâu chơi nào ạ?'
                    }
                ]);
            }
        } catch (err: any) {
            console.error('Load history error:', err);

            if (err.response?.status === 401) {
                sessionStorage.removeItem('jwtToken');
                localStorage.removeItem('jwtToken');
            }

            if (messages.length === 0) {
                setMessages([
                    {
                        role: 'bot',
                        content:
                            'Chào anh/chị! Em là trợ lý du lịch AI đây ạ! Anh/chị muốn đi đâu chơi nào? Phú Quốc, Đà Lạt, Sapa hay Hàn Quốc?'
                    }
                ]);
            }
        } finally {
            setIsLoadingHistory(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadChatHistory();
        }
    }, [isOpen]);

    const sendMessage = async () => {
        if (!input.trim() || isTyping) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsTyping(true);

        try {
            const token = sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');

            const res = await axios.post(
                'http://localhost:8080/api/chatbot/ask',
                { message: userMsg },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    withCredentials: true,
                }
            );

            const botReply = res.data.reply || 'Em đang tìm tour hot cho anh/chị đây ạ...';
            setMessages(prev => [...prev, { role: 'bot', content: botReply }]);
        } catch (err: any) {
            console.error('Chatbot error:', err);
            setMessages(prev => [...prev, {
                role: 'bot',
                content: 'Oops! Em đang hơi lag xíu, anh/chị gửi lại giúp em nha!'
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleTourLinkClick = (tourId: string) => {
        navigate(`/tour/${tourId}`);
    };

    const renderBotMessage = (content: string): React.ReactNode[] => {
        const segments: React.ReactNode[] = [];
        let key = 0;
        const parts = content.split(/(\n|\/tour\/\d+)/g);

        for (const part of parts) {
            if (part === '\n') {
                segments.push(<br key={key++} />);
            } else if (part.match(/\/tour\/\d+/)) {
                const tourId = part.match(/\/tour\/(\d+)/)?.[1];
                if (tourId) {
                    segments.push(
                        <button
                            key={key++}
                            onClick={() => handleTourLinkClick(tourId)}
                            className="inline-flex items-center gap-2 mt-3 mb-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm group relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Xem chi tiết tour
                                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                        </button>
                    );
                }
            } else if (part.trim()) {
                segments.push(
                    <span key={key++} className="leading-relaxed block">
                        {part}
                    </span>
                );
            }
        }
        return segments;
    };

    // NÚT MỞ CHATBOT
    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-full shadow-2xl shadow-purple-500/50 flex items-center justify-center hover:scale-110 hover:shadow-purple-500/70 transition-all duration-300 group"
            >
                <MessageCircle className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full animate-pulse shadow-lg"></div>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] h-[650px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl border border-gray-200/50">

            {/* Header */}
            <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white p-6">
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
                                <Bot className="w-8 h-8 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full border-2 border-white shadow-md animate-pulse"></div>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Trợ Lý Du Lịch AI</h3>
                            <p className="text-xs opacity-90 flex items-center gap-1.5 mt-0.5">
                                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                                <span>{isLoadingHistory ? 'Đang tải lịch sử...' : 'Đang hoạt động'}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-10 h-10 rounded-xl hover:bg-white/20 backdrop-blur-sm transition-all flex items-center justify-center group border border-white/20"
                    >
                        <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gradient-to-b from-gray-50/80 via-white to-purple-50/30">
                {isLoadingHistory ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                        <span className="ml-3 text-gray-600">Đang tải lịch sử chat...</span>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-300`}>
                                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md
                                        ${msg.role === 'user'
                                            ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                                            : 'bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500'}`}>
                                        {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                                    </div>

                                    <div className={`px-4 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all
                                        ${msg.role === 'user'
                                            ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                                            : 'bg-white text-gray-800 border border-gray-100'}`}>
                                        {msg.role === 'bot' ? renderBotMessage(msg.content) : (
                                            <p className="whitespace-pre-wrap text-sm font-medium">{msg.content}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-md">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="bg-white px-5 py-3.5 rounded-2xl shadow-sm border border-gray-100">
                                        <div className="flex gap-1.5">
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input */}
            <div className="p-5 border-t border-gray-200/50 bg-white">

                {/* 🔥 SUGGESTIONS UI — ALWAYS SHOW */}
                <div className="flex gap-2 flex-wrap mb-3">
                    {suggestions.map((text, index) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(text)}
                            className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white text-xs rounded-full shadow-md hover:opacity-90 transition-all"
                        >
                            {text}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2.5">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isTyping && sendMessage()}
                        placeholder="Hỏi em về tour, giá cả, ngày đi..."
                        className="flex-1 px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all text-sm bg-white shadow-sm placeholder:text-gray-400"
                        disabled={isLoadingHistory}
                    />

                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || isTyping || isLoadingHistory}
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white flex items-center justify-center hover:scale-105 hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>

                <p className="text-center text-xs text-gray-500 mt-3 flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    <span>Được hỗ trợ bởi <span className="font-semibold text-purple-600">Groq</span> • Dữ liệu realtime</span>
                </p>
            </div>

        </div>
    );
}
