import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    MapPin, Phone, Mail, Clock, Send, Facebook, Youtube,
    MessageCircle, Globe, CheckCircle, Loader2
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Vui lòng điền đầy đủ họ tên, email và nội dung tin nhắn');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSent(true);
            toast.success('Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ sớm nhất.');
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            setTimeout(() => setSent(false), 5000);
        }, 1500);
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={4000} />

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
                            className="text-5xl md:text-6xl boldness mb-6"
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
                            {/* Card thông tin - đã bỏ bóng */}
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

                            {/* Social - cũng bỏ bóng */}
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
                            {/* Form - bỏ bóng */}
                            <motion.div
                                className="bg-white rounded-2xl p-8 border border-slate-200"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-3xl font-bold text-slate-900 mb-8">
                                    Gửi Tin Nhắn Cho Chúng Tôi
                                </h2>

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
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Họ và tên *" className="w-full px-5 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition" />
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email *" className="w-full px-5 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Số điện thoại" className="w-full px-5 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition" />
                                        <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Chủ đề" className="w-full px-5 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition" />
                                    </div>

                                    <textarea name="message" value={formData.message} onChange={handleChange} rows={6} placeholder="Nội dung tin nhắn *" className="w-full px-5 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition resize-none"></textarea>

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

                            {/* Bản đồ - đã thay link Hà Nội + bỏ bóng */}
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

                {/* CTA cuối trang */}
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