import React, { useState, useEffect } from "react";
import { Menu, X, User, LogOut, BookmarkCheck } from "lucide-react";
import logoImg from "../../../../../assets/images/logo/logo.png";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [openUserMenu, setOpenUserMenu] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogin = () => {
        navigate("/login"); // <-- Redirect sang trang Login
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/"); // về trang chủ
    };

    return (
        <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : "bg-transparent"}`}>
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <a href="/" className="flex items-center">
                        <img src={logoImg} alt="WonderTrail Logo" className="h-16 w-auto transition hover:scale-105" />
                    </a>

                    {/* Desktop menu */}
                    <div className="hidden md:flex space-x-8">
                        {[
                            { name: "Trang chủ", to: "/" },
                            { name: "Điểm đến", to: "/diem-den" },
                            { name: "Tour", to: "/tour" },
                            { name: "Blog", to: "/blog" },
                            { name: "Về chúng tôi", to: "/ve-chung-toi" }
                        ].map((item) => (
                            <a
                                key={item.name}
                                href={item.to}
                                className={`${isScrolled ? "text-gray-700 hover:text-teal-700" : "text-white hover:text-amber-300"} transition`}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Giỏ tour */}
                        <a href="/my-tours" className={`${isScrolled ? "text-gray-700" : "text-white"}`}>
                            <BookmarkCheck size={24} className="hover:scale-110 transition" />
                        </a>

                        {/* Login / User */}
                        {!isLoggedIn ? (
                            <button
                                onClick={handleLogin}
                                className={`${isScrolled
                                    ? "bg-teal-800 text-white"
                                    : "bg-white text-teal-800"} px-6 py-2 rounded-lg transition hover:opacity-90`}
                            >
                                Đăng nhập
                            </button>
                        ) : (
                            <div className="relative">
                                <button onClick={() => setOpenUserMenu(!openUserMenu)}>
                                    <User size={26} className={`${isScrolled ? "text-gray-800" : "text-white"}`} />
                                </button>
                                {openUserMenu && (
                                    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-40">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100"
                                        >
                                            <LogOut size={18} /> Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button className={`md:hidden ${isScrolled ? "text-gray-800" : "text-white"}`} onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Header;
