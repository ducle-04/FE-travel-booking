import React, { useState, useRef, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { Search, Bell, Moon, Sun, Camera, Trash2, Edit } from "lucide-react";
import { useTheme } from "../../../../../context/ThemeContext";
import EditProfileModal from "./EditProfileModal";
import { fetchUserProfile, uploadAvatar, deleteAvatar } from "../../../../../services/userService";

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
        avatarUrl?: string;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { theme, toggleTheme } = useTheme();

    // TỰ ĐỘNG LOAD PROFILE KHI MỞ TRANG
    useEffect(() => {
        const loadProfile = async () => {
            const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');
            if (!token) return;

            try {
                const profileData = await fetchUserProfile(token);
                setProfile(profileData);
            } catch (err: any) {
                console.warn('Không thể tải profile:', err.message);
            }
        };

        loadProfile();
    }, []);

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
            if (!token) throw new Error('Vui lòng đăng nhập lại.');
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

    const handleUpdateProfile = (updatedProfile: any) => {
        setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setError('Kích thước ảnh không được vượt quá 5MB');
            return;
        }

        setUploadingAvatar(true);
        try {
            const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');
            if (!token) throw new Error('Vui lòng đăng nhập lại.');
            const newUrl = await uploadAvatar(token, file);
            setProfile(prev => prev ? { ...prev, avatarUrl: newUrl } : null);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Upload ảnh thất bại.');
        } finally {
            setUploadingAvatar(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDeleteAvatar = async () => {
        if (!profile?.avatarUrl) return;
        try {
            const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');
            if (!token) throw new Error('Vui lòng đăng nhập lại.');
            await deleteAvatar(token);
            setProfile(prev => prev ? { ...prev, avatarUrl: undefined } : null);
        } catch (err: any) {
            setError(err.message || 'Xóa ảnh thất bại.');
        }
    };

    return (
        <header className={`w-full h-16 border-b shadow-sm flex items-center justify-between px-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
            }`}>
            {/* Toggle Sidebar */}
            <button onClick={onToggleSidebar} className={`hover:text-cyan-900 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                <FaBars size={20} />
            </button>

            {/* Search Bar */}
            <div className="flex-1 flex justify-center max-w-md mx-auto">
                <div className="w-full relative">
                    <input
                        className={`w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-700'
                            }`}
                        placeholder="Tìm kiếm..."
                    />
                    <Search className={`absolute right-3 top-2.5 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                {/* Theme Toggle */}
                <button onClick={toggleTheme} className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}>
                    {theme === "dark" ? (
                        <Sun className="w-5 h-5 text-yellow-400" />
                    ) : (
                        <Moon className="w-5 h-5 text-gray-600" />
                    )}
                </button>

                {/* Notifications */}
                <button className={`p-2 rounded-lg relative ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}>
                    <Bell className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Menu */}
                <div className="relative" ref={menuRef}>
                    <button onClick={() => setShowMenu(!showMenu)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        {/* AVATAR - KHÔNG CÓ HOVER EFFECT */}
                        {profile?.avatarUrl ? (
                            <img
                                src={profile.avatarUrl}
                                alt="Avatar"
                                className="w-10 h-10 rounded-full object-cover border-2 border-cyan-500"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                    {profile?.fullname?.[0]?.toUpperCase() || 'A'}
                                </span>
                            </div>
                        )}
                        <span className={`hidden sm:block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                            {profile?.fullname || adminName || "Quản trị viên"}
                        </span>
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div className={`absolute right-0 mt-2 shadow-xl border rounded-xl w-72 z-50 overflow-hidden backdrop-blur-sm ${theme === 'dark'
                            ? 'bg-gray-800/95 border-gray-700/50'
                            : 'bg-white/95 border-gray-200/50'
                            }`}>
                            {/* User Info Section */}
                            <div className={`p-5 border-b ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-100'
                                }`}>
                                <div className="flex items-center gap-3">
                                    {/* Avatar in Dropdown - không hover */}
                                    {profile?.avatarUrl ? (
                                        <img
                                            src={profile.avatarUrl}
                                            alt="Avatar"
                                            className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">
                                                {profile?.fullname?.[0]?.toUpperCase() || 'A'}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                            }`}>
                                            {profile?.fullname || 'Quản trị viên'}
                                        </p>
                                        <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                            {profile?.email || 'admin@example.com'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Actions */}
                            <div className="py-2">
                                {/* Edit Profile */}
                                <button
                                    onClick={handleOpenEditProfile}
                                    className={`w-full text-left px-5 py-3 text-sm flex items-center gap-3 transition-all duration-200 ${theme === 'dark'
                                        ? 'text-gray-200 hover:bg-gray-700/50'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={loading}
                                >
                                    <div className={`p-1.5 rounded-lg ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'
                                        }`}>
                                        <Edit className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                                            }`} />
                                    </div>
                                    <span className="font-medium">Chỉnh sửa hồ sơ</span>
                                </button>

                                {/* Upload Avatar - DÙNG MENU */}
                                <label className={`w-full text-left px-5 py-3 text-sm flex items-center gap-3 cursor-pointer transition-all duration-200 ${theme === 'dark'
                                    ? 'text-gray-200 hover:bg-gray-700/50'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    } ${uploadingAvatar ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <div className={`p-1.5 rounded-lg ${theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'
                                        }`}>
                                        <Camera className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                                            }`} />
                                    </div>
                                    <span className="font-medium flex-1">Cập nhật ảnh đại diện</span>
                                    {uploadingAvatar && (
                                        <div className="flex items-center gap-1">
                                            <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" />
                                            <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse [animation-delay:0.2s]" />
                                            <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse [animation-delay:0.4s]" />
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                        disabled={uploadingAvatar}
                                    />
                                </label>

                                {/* Delete Avatar */}
                                {profile?.avatarUrl && (
                                    <>
                                        <div className={`my-2 mx-5 border-t ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-100'
                                            }`} />
                                        <button
                                            onClick={handleDeleteAvatar}
                                            className={`w-full text-left px-5 py-3 text-sm flex items-center gap-3 transition-all duration-200 group ${theme === 'dark'
                                                ? 'text-red-400 hover:bg-red-500/10'
                                                : 'text-red-600 hover:bg-red-50'
                                                }`}
                                        >
                                            <div className={`p-1.5 rounded-lg transition-colors ${theme === 'dark'
                                                ? 'bg-red-500/10 group-hover:bg-red-500/20'
                                                : 'bg-red-50 group-hover:bg-red-100'
                                                }`}>
                                                <Trash2 className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium">Xóa ảnh đại diện</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Profile Modal */}
            {showEditProfileModal && profile && (
                <EditProfileModal
                    profile={profile}
                    onClose={() => setShowEditProfileModal(false)}
                    onUpdate={handleUpdateProfile}
                />
            )}

            {/* Error Toast */}
            {error && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg animate-pulse ${theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'
                    }`}>
                    {error}
                    <button
                        onClick={() => setError(null)}
                        className="ml-2 text-xs underline opacity-75"
                    >
                        ×
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;