import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FaUsers,
    FaGlobeAsia,
    FaRegComments,
    FaFlag,
    FaUserShield,
    FaCog,
    FaNewspaper,
    FaSuitcaseRolling,
    FaShoppingCart,
    FaSignOutAlt
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import logoImg from "../../../../../assets/images/logo/logo.png";
import logoImgKC from "../../../../../assets/images/logo/logo-khongchu.png";
import { useTheme } from "../../../../../context/ThemeContext"; // ✅ thêm

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

const menu = [
    { label: "Dashboard", icon: <MdDashboard className="w-5 h-5" />, path: "/admin" },
    { label: "Quản lý Tour", icon: <FaSuitcaseRolling className="w-5 h-5" />, path: "/admin/tours" },
    { label: "Quản lý Đặt Tour", icon: <FaShoppingCart className="w-5 h-5" />, path: "/admin/bookings" },
    { label: "Quản lý Tài Khoản", icon: <FaUsers className="w-5 h-5" />, path: "/admin/users" },
    { label: "Quản lý Điểm Đến", icon: <FaGlobeAsia className="w-5 h-5" />, path: "/admin/destinations" },
    { label: "Quản lý Bài Viết", icon: <FaNewspaper className="w-5 h-5" />, path: "/admin/posts" },
    { label: "Quản lý Banner", icon: <FaFlag className="w-5 h-5" />, path: "/admin/banners" },
    { label: "Phản Hồi / Đánh Giá", icon: <FaRegComments className="w-5 h-5" />, path: "/admin/reviews" },
    { label: "Cài Đặt Hệ Thống", icon: <FaCog className="w-5 h-5" />, path: "/admin/settings" },
    { label: "Tài Khoản Admin", icon: <FaUserShield className="w-5 h-5" />, path: "/admin/account" }
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme } = useTheme(); // ✅ lấy theme từ context

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <aside
            className={`h-screen flex flex-col justify-between shadow-lg border-r transition-all duration-300 
      ${isOpen ? "w-56" : "w-16"} 
      ${theme === "dark"
                    ? "bg-gray-800 text-gray-200 border-gray-700"
                    : "bg-white text-gray-800 border-gray-200"
                }`}
        >
            {/* Logo + Menu */}
            <div>
                {/* Logo */}
                <div
                    className={`flex items-center justify-center py-4 border-b transition-colors duration-300 
          ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
                >
                    {isOpen ? (
                        <div className="flex items-center space-x-2">
                            <img src={logoImgKC} alt="Logo" className="w-8 h-8" />
                            <span className="font-bold text-lg bg-gradient-to-r from-green-400 to-indigo-500 text-transparent bg-clip-text">
                                WonderTrail
                            </span>
                        </div>
                    ) : (
                        <img src={logoImg} alt="Logo" className="w-8 h-8 mx-auto" />
                    )}
                </div>

                {/* Menu */}
                <ul className="mt-2 space-y-1 px-2">
                    {menu.map((item) => (
                        <li key={item.path} className="relative group">
                            <Link
                                to={item.path}
                                className={`flex items-center px-3 py-3 rounded-lg transition-all ${location.pathname.startsWith(item.path)
                                        ? theme === "dark"
                                            ? "bg-indigo-900 text-indigo-300"
                                            : "bg-indigo-50 text-indigo-600"
                                        : theme === "dark"
                                            ? "text-gray-300 hover:bg-gray-700"
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <span className="mr-3">{item.icon}</span>
                                {isOpen && <span className="text-sm whitespace-nowrap">{item.label}</span>}
                            </Link>

                            {/* Tooltip khi sidebar thu gọn */}
                            {!isOpen && (
                                <div
                                    className={`absolute left-full top-1/2 -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 transition 
                    ${theme === "dark"
                                            ? "bg-gray-700 text-gray-100 border-gray-600"
                                            : "bg-white text-gray-800 border-gray-200"}
                    border shadow-lg px-3 py-1 rounded whitespace-nowrap z-50 text-sm`}
                                >
                                    {item.label}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 🔚 Đăng xuất */}
            <div
                className={`border-t h-12 flex items-center justify-center transition-colors duration-300 
        ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            >
                <button
                    onClick={handleLogout}
                    className={`flex items-center rounded-lg px-4 py-2 transition text-sm
          ${theme === "dark"
                            ? "text-red-400 hover:bg-red-900"
                            : "text-red-600 hover:bg-red-100"}`}
                >
                    <FaSignOutAlt className="w-5 h-5 mr-2" />
                    {isOpen && <span>Đăng xuất</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
