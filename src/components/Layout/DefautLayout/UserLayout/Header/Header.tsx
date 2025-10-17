import React, { useState, useEffect } from "react";
import { Menu, X, User, LogOut, BookmarkCheck, Settings } from "lucide-react";
import logoImg from "../../../../../assets/images/logo/logo.png";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState<string>(''); // Lấy từ API
    const [openUserMenu, setOpenUserMenu] = useState(false);

    const API_BASE_URL = 'http://localhost:8080'; // Thay nếu BE port khác

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
            if (token) {
                try {
                    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const data = await response.json(); // UserDTO
                        setUsername(data.username || '');
                        setIsLoggedIn(true);
                    } else {
                        // Unauthorized hoặc error → Logout
                        handleLogout();
                    }
                } catch (error) {
                    console.error('Error fetching profile:', error);
                    handleLogout();
                }
            } else {
                setUsername('');
                setIsLoggedIn(false);
            }
        };
        checkLoginStatus();

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);

        // Listen for storage changes (login/logout ở tab khác)
        window.addEventListener("storage", checkLoginStatus);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("storage", checkLoginStatus);
        };
    }, []);

    const handleLogin = () => {
        navigate("/login");
    };

    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        sessionStorage.removeItem("jwtToken");
        setIsLoggedIn(false);
        setUsername('');
        setOpenUserMenu(false);
        navigate("/");
    };

    const handleProfile = () => {
        setOpenUserMenu(false);
        navigate("/profile");
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        setIsOpen(false);
    };

    return (
        <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : "bg-transparent"}`}>
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <button onClick={() => handleNavigate("/")} className="flex items-center">
                        <img src={logoImg} alt="WonderTrail Logo" className="h-16 w-auto transition hover:scale-105" />
                    </button>

                    {/* Desktop menu */}
                    <div className="hidden md:flex space-x-8">
                        {[
                            { name: "Trang chủ", to: "/" },
                            { name: "Điểm đến", to: "/destination" },
                            { name: "Tour", to: "/tours" },
                            { name: "Blog", to: "/blog" },
                            { name: "Về chúng tôi", to: "/about" },
                            { name: "Liên hệ", to: "/contact" }
                        ].map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleNavigate(item.to)}
                                className={`${isScrolled ? "text-gray-700 hover:text-teal-700" : "text-white hover:text-amber-300"} transition font-medium`}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Giỏ tour */}
                        <button onClick={() => handleNavigate("/my-tours")} className={`${isScrolled ? "text-gray-700" : "text-white"}`}>
                            <BookmarkCheck size={24} className="hover:scale-110 transition" />
                        </button>

                        {/* Login / User */}
                        {!isLoggedIn ? (
                            <button
                                onClick={handleLogin}
                                className={`${isScrolled
                                    ? "bg-teal-800 text-white"
                                    : "bg-white text-teal-800"} px-6 py-2 rounded-lg transition hover:opacity-90 font-semibold`}
                            >
                                Đăng nhập
                            </button>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setOpenUserMenu(!openUserMenu)}
                                    className={`flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-full shadow-sm transition 
                ${isScrolled ? "bg-white text-gray-800 hover:bg-gray-100" : "bg-white text-teal-800 hover:bg-teal-100"}`}
                                >
                                    <User size={26} className="text-current" />
                                    <span className="font-medium">{username || 'User'}</span>
                                </button>

                                {openUserMenu && (
                                    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 py-2 border border-gray-200">
                                        <button
                                            onClick={handleProfile}
                                            className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-left text-gray-700"
                                        >
                                            <Settings size={18} /> Chỉnh sửa profile
                                        </button>
                                        <hr className="border-gray-200" />
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-left text-gray-700"
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

                {/* Mobile menu dropdown */}
                {isOpen && (
                    <div className="md:hidden bg-white shadow-md px-4 py-4 space-y-4">
                        {[
                            { name: "Trang chủ", to: "/" },
                            { name: "Điểm đến", to: "/destination" },
                            { name: "Tour", to: "/tours" },
                            { name: "Blog", to: "/blog" },
                            { name: "Về chúng tôi", to: "/about" },
                            { name: "Liên hệ", to: "/contact" }
                        ].map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleNavigate(item.to)}
                                className="block w-full text-left text-gray-700 hover:text-teal-700"
                            >
                                {item.name}
                            </button>
                        ))}
                        {!isLoggedIn ? (
                            <button onClick={handleLogin} className="block w-full text-teal-800 hover:underline">
                                Đăng nhập
                            </button>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <User size={20} />
                                    <span>{username || 'User'}</span>
                                </div>
                                <button onClick={handleProfile} className="block w-full text-left text-gray-700 hover:underline">
                                    Chỉnh sửa profile
                                </button>
                                <button onClick={handleLogout} className="block w-full text-left text-gray-700 hover:underline">
                                    Đăng xuất
                                </button>
                            </>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;