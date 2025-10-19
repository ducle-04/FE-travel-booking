import React, { useState, useRef, useEffect } from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { Search, Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "../../../../../context/ThemeContext";
import EditProfileModal from "./EditProfileModal";
import { fetchUserProfile } from "../../../../../services/userService";

interface HeaderProps {
    onToggleSidebar: () => void;
    adminName?: string;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, adminName }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [profile, setProfile] = useState<{
        username: string;
        email: string;
        fullname: string;
        phoneNumber: string;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleOpenEditProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('Vui lòng đăng nhập lại.');
            }
            const profileData = await fetchUserProfile(token);
            setProfile(profileData);
            setShowEditProfileModal(true);
            setShowMenu(false);
        } catch (err: any) {
            setError(err.message || 'Không thể tải thông tin hồ sơ.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = (updatedProfile: {
        username: string;
        email: string;
        fullname: string;
        phoneNumber: string;
    }) => {
        setProfile(updatedProfile);
    };

    return (
        <header className={`w-full h-16 border-b shadow-sm flex items-center justify-between px-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
            }`}>
            <button onClick={onToggleSidebar} className={`hover:text-cyan-900 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                <FaBars size={20} />
            </button>

            <div className="flex-1 flex justify-center max-w-md mx-auto">
                <div className="w-full relative">
                    <input
                        className={`w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-700'
                            }`}
                        placeholder="Search"
                    />
                    <Search className={`absolute right-3 top-2.5 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button onClick={toggleTheme} className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}>
                    {theme === "dark" ? (
                        <Sun className="w-5 h-5 text-yellow-400" />
                    ) : (
                        <Moon className="w-5 h-5 text-gray-600" />
                    )}
                </button>

                <button className={`p-2 rounded-lg relative ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}>
                    <Bell className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="relative" ref={menuRef}>
                    <button onClick={() => setShowMenu(!showMenu)} className="flex items-center gap-2 hover:opacity-80">
                        <FaUserCircle size={32} className={`text-blue-600 dark:text-blue-400`} />
                        <span className={`hidden sm:block text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                            {adminName || profile?.fullname || "Quản trị viên"}
                        </span>
                    </button>

                    {showMenu && (
                        <div className={`absolute right-0 mt-2 shadow-lg border rounded w-48 z-50 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                            }`}>
                            <button
                                onClick={handleOpenEditProfile}
                                className={`w-full text-left px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                disabled={loading}
                            >
                                Chỉnh sửa hồ sơ
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showEditProfileModal && profile && (
                <EditProfileModal
                    profile={profile}
                    onClose={() => setShowEditProfileModal(false)}
                    onUpdate={handleUpdateProfile}
                />
            )}
            {error && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'
                    }`}>
                    {error}
                </div>
            )}
        </header>
    );
};

export default Header;