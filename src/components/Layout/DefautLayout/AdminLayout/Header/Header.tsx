import React, { useState, useRef, useEffect } from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { Search, Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "../../../../../context/ThemeContext"; // ✅ import

interface HeaderProps {
    onToggleSidebar: () => void;
    adminName?: string;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, adminName }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { theme, toggleTheme } = useTheme(); // ✅ sử dụng context

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="w-full h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between px-6 transition-colors duration-300">
            <button onClick={onToggleSidebar} className="text-cyan-600 hover:text-cyan-900 dark:text-cyan-400">
                <FaBars size={20} />
            </button>

            <div className="flex-1 flex justify-center max-w-md mx-auto">
                <div className="w-full relative">
                    <input
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                        placeholder="Search"
                    />
                    <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* 🌙 / ☀️ Nút chuyển theme */}
                <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                    {theme === "dark" ? (
                        <Sun className="w-5 h-5 text-yellow-400" />
                    ) : (
                        <Moon className="w-5 h-5 text-gray-600" />
                    )}
                </button>

                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative">
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="relative" ref={menuRef}>
                    <button onClick={() => setShowMenu(!showMenu)} className="flex items-center gap-2 hover:opacity-80">
                        <FaUserCircle size={32} className="text-blue-600 dark:text-blue-400" />
                        <span className="hidden sm:block text-sm text-gray-700 dark:text-gray-200">
                            {adminName || "Quản trị viên"}
                        </span>
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded w-48 z-50">
                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                                Xem hồ sơ
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900">
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
