import { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
    const animatedRef = useRef<boolean>(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            const footer = document.querySelector('.footer-container');
            const elements = document.querySelectorAll('.footer-animate-item');

            if (footer) {
                const rect = footer.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight - 100;

                if (isVisible) {
                    if (!animatedRef.current) {
                        footer.classList.add('footer-visible');
                        elements.forEach((el, index) => {
                            setTimeout(() => {
                                el.classList.add('footer-item-visible');
                            }, 150 * index);
                        });
                        animatedRef.current = true;
                    }
                } else {
                    footer.classList.remove('footer-visible');
                    elements.forEach((el) => el.classList.remove('footer-item-visible'));
                    animatedRef.current = false;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        setTimeout(handleScroll, 300);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    return (
        <footer className="footer-container bg-gradient-to-b from-slate-900 to-black text-white pt-16 pb-6 mt-20 border-t border-white/10 shadow-2xl opacity-0 translate-y-5 transition-all duration-[600ms] ease-[cubic-bezier(0.4,2,0.6,1)] [&.footer-visible]:opacity-100 [&.footer-visible]:translate-y-0">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="footer-animate-item opacity-0 translate-y-10 scale-95 transition-all duration-[600ms] ease-[cubic-bezier(0.4,2,0.6,1)] [&.footer-item-visible]:opacity-100 [&.footer-item-visible]:translate-y-0 [&.footer-item-visible]:scale-100">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="bg-gradient-to-br from-cyan-500 to-teal-600 p-2 rounded-lg">
                                <MapPin className="text-white" size={24} />
                            </div>
                            <span className="font-extrabold text-2xl bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">TravelGo</span>
                        </div>
                        <p className="italic text-gray-300 text-sm mb-4">Khám phá thế giới cùng chúng tôi</p>
                        <div className="space-y-2 text-gray-400 text-sm">
                            <div className="flex items-center">
                                <Phone size={16} className="mr-3 text-cyan-400" />
                                <span>0123 456 789</span>
                            </div>
                            <div className="flex items-center">
                                <Mail size={16} className="mr-3 text-cyan-400" />
                                <span>info@travelgo.com</span>
                            </div>
                            <div className="flex items-center">
                                <MapPin size={16} className="mr-3 text-cyan-400" />
                                <span>123 Đường Du Lịch, Hà Nội</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-animate-item opacity-0 translate-y-10 scale-95 transition-all duration-[600ms] ease-[cubic-bezier(0.4,2,0.6,1)] [&.footer-item-visible]:opacity-100 [&.footer-item-visible]:translate-y-0 [&.footer-item-visible]:scale-100">
                        <h5 className="relative font-bold text-white mb-4 pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-10 after:bg-gradient-to-r after:from-cyan-400 after:to-teal-500 after:rounded">
                            Liên kết nhanh
                        </h5>
                        <ul className="list-none space-y-2">
                            {['Tours', 'Điểm đến', 'Về chúng tôi', 'Liên hệ', 'Blog du lịch'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="inline-flex items-center text-gray-400 hover:text-cyan-400 transition-all duration-200 hover:translate-x-1 before:content-['›'] before:mr-2 before:text-cyan-400">
                                        <span className="ml-6">{item}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="footer-animate-item opacity-0 translate-y-10 scale-95 transition-all duration-[600ms] ease-[cubic-bezier(0.4,2,0.6,1)] [&.footer-item-visible]:opacity-100 [&.footer-item-visible]:translate-y-0 [&.footer-item-visible]:scale-100">
                        <h5 className="relative font-bold text-white mb-4 pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-10 after:bg-gradient-to-r after:from-cyan-400 after:to-teal-500 after:rounded">
                            Dịch vụ
                        </h5>
                        <ul className="list-none space-y-2">
                            {['Đặt tour', 'Khách sạn', 'Đưa đón', 'Hướng dẫn viên', 'Hỗ trợ'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="inline-flex items-center text-gray-400 hover:text-cyan-400 transition-all duration-200 hover:translate-x-1 before:content-['›'] before:mr-2 before:text-cyan-400">
                                        <span className="ml-6">{item}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter & Social */}
                    <div className="footer-animate-item opacity-0 translate-y-10 scale-95 transition-all duration-[600ms] ease-[cubic-bezier(0.4,2,0.6,1)] [&.footer-item-visible]:opacity-100 [&.footer-item-visible]:translate-y-0 [&.footer-item-visible]:scale-100">
                        <h5 className="relative font-bold text-white mb-4 pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-10 after:bg-gradient-to-r after:from-cyan-400 after:to-teal-500 after:rounded">
                            Kết nối với chúng tôi
                        </h5>
                        <div className="mb-4">
                            <p className="mb-3 text-gray-300 text-sm">Đăng ký nhận thông tin mới nhất</p>
                            <div className="flex">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-white/10 border border-white/20 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-full text-white placeholder-gray-400 transition"
                                    placeholder="Email của bạn"
                                    aria-label="Email subscription"
                                />
                                <button className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-4 py-2 rounded-r-lg hover:shadow-lg hover:shadow-cyan-500/30 transition">
                                    <Mail size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {[
                                { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
                                { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
                                { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
                                { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' }
                            ].map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/20 text-gray-300 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-teal-600 hover:text-white hover:border-transparent hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                                    aria-label={label}
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-6 mt-8"></div>

                {/* Bottom Section */}
                <div className="footer-animate-item grid grid-cols-1 md:grid-cols-2 gap-4 items-center opacity-0 translate-y-10 scale-95 transition-all duration-[600ms] ease-[cubic-bezier(0.4,2,0.6,1)] [&.footer-item-visible]:opacity-100 [&.footer-item-visible]:translate-y-0 [&.footer-item-visible]:scale-100">
                    <p className="text-center md:text-left text-sm text-gray-400">
                        © {new Date().getFullYear()} TravelGo. All rights reserved.
                    </p>
                    <div className="text-center md:text-right space-x-4 text-sm">
                        <a href="#" className="text-gray-400 hover:text-cyan-400 hover:underline transition">
                            Chính sách bảo mật
                        </a>
                        <a href="#" className="text-gray-400 hover:text-cyan-400 hover:underline transition">
                            Điều khoản sử dụng
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;