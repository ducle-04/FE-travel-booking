import React from 'react';
import { X, Mail, Phone, Shield, Calendar, User as UserIcon } from 'lucide-react';
import { useTheme } from '../../../../../context/ThemeContext';

interface User {
    id: number;
    username: string;
    email: string;
    fullname: string;
    phoneNumber: string;
    status: 'Hoạt động' | 'Không hoạt động' | 'Bị cấm' | 'Đã xóa';
    role: string;
    createdAt: string;
}

interface DetailUserModalProps {
    user: User;
    onClose: () => void;
}

const DetailUserModal: React.FC<DetailUserModalProps> = ({ user, onClose }) => {
    const { theme } = useTheme();

    const getRoleLabel = (role: string): string => {
        const roleMap: { [key: string]: string } = {
            'USER': 'Khách',
            'STAFF': 'Nhân viên',
            'ADMIN': 'Quản trị'
        };
        return roleMap[role] || role;
    };

    const getStatusColor = (status: string): string => {
        const colors: { [key: string]: string } = {
            'Hoạt động': `bg-emerald-50 text-emerald-700 border border-emerald-200 ${theme === 'dark' ? 'bg-emerald-900/50 text-emerald-300 border-emerald-700' : ''
                }`,
            'Không hoạt động': `bg-gray-100 text-gray-600 border border-gray-300 ${theme === 'dark' ? 'bg-gray-700 text-gray-300 border-gray-600' : ''
                }`,
            'Bị cấm': `bg-red-50 text-red-700 border border-red-200 ${theme === 'dark' ? 'bg-red-900/50 text-red-300 border-red-700' : ''
                }`,
            'Đã xóa': `bg-slate-100 text-slate-600 border border-slate-300 ${theme === 'dark' ? 'bg-slate-700 text-slate-300 border-slate-600' : ''
                }`,
        };
        return colors[status] || `bg-gray-100 text-gray-600 border border-gray-300 ${theme === 'dark' ? 'bg-gray-700 text-gray-300 border-gray-600' : ''
            }`;
    };

    const getRoleBadgeColor = (role: string): string => {
        switch (role) {
            case 'ADMIN':
                return `bg-red-100 text-red-700 ${theme === 'dark' ? 'bg-red-900/50 text-red-300' : ''}`;
            case 'STAFF':
                return `bg-blue-100 text-blue-700 ${theme === 'dark' ? 'bg-blue-900/50 text-blue-300' : ''}`;
            default:
                return `bg-gray-100 text-gray-700 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : ''}`;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
                className={`rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}
            >
                {/* Header */}
                <div
                    className={`sticky top-0 bg-gradient-to-r ${theme === 'dark' ? 'from-gray-800 to-gray-900' : 'from-slate-700 to-slate-800'
                        } text-white px-6 py-4 flex items-center justify-between border-b-2 ${theme === 'dark' ? 'border-gray-700' : 'border-slate-900'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${theme === 'dark' ? 'bg-gray-600 text-gray-200' : 'bg-slate-600 text-white'
                                }`}
                        >
                            {user.fullname.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{user.fullname}</h2>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-slate-300'}`}>
                                @{user.username}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-slate-600'
                            }`}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Tài khoản */}
                        <div
                            className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                                }`}
                        >
                            <label
                                className={`flex items-center gap-2 text-xs font-semibold mb-2 uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                    }`}
                            >
                                <UserIcon size={14} />
                                Tài khoản
                            </label>
                            <p
                                className={`text-sm font-mono px-2.5 py-1.5 rounded border ${theme === 'dark'
                                        ? 'bg-gray-800 border-gray-600 text-gray-200'
                                        : 'bg-white border-gray-300 text-gray-700'
                                    }`}
                            >
                                {user.username}
                            </p>
                        </div>

                        {/* Email */}
                        <div
                            className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                                }`}
                        >
                            <label
                                className={`flex items-center gap-2 text-xs font-semibold mb-2 uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                    }`}
                            >
                                <Mail size={14} />
                                Email
                            </label>
                            <p
                                className={`text-sm px-2.5 py-1.5 rounded border break-all ${theme === 'dark'
                                        ? 'bg-gray-800 border-gray-600 text-gray-200'
                                        : 'bg-white border-gray-300 text-gray-700'
                                    }`}
                            >
                                {user.email}
                            </p>
                        </div>

                        {/* Số điện thoại */}
                        <div
                            className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                                }`}
                        >
                            <label
                                className={`flex items-center gap-2 text-xs font-semibold mb-2 uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                    }`}
                            >
                                <Phone size={14} />
                                Số điện thoại
                            </label>
                            <p
                                className={`text-sm px-2.5 py-1.5 rounded border ${theme === 'dark'
                                        ? 'bg-gray-800 border-gray-600 text-gray-200'
                                        : 'bg-white border-gray-300 text-gray-700'
                                    }`}
                            >
                                {user.phoneNumber}
                            </p>
                        </div>

                        {/* Vai trò */}
                        <div
                            className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                                }`}
                        >
                            <label
                                className={`flex items-center gap-2 text-xs font-semibold mb-2 uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                    }`}
                            >
                                <Shield size={14} />
                                Vai trò
                            </label>
                            <div
                                className={`text-sm font-semibold px-2.5 py-1.5 rounded border text-center ${getRoleBadgeColor(
                                    user.role
                                )}`}
                            >
                                {getRoleLabel(user.role)}
                            </div>
                        </div>

                        {/* Trạng thái */}
                        <div
                            className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                                }`}
                        >
                            <label
                                className={`block text-xs font-semibold mb-2 uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                    }`}
                            >
                                Trạng thái
                            </label>
                            <div
                                className={`text-sm font-semibold px-2.5 py-1.5 rounded border text-center ${getStatusColor(
                                    user.status
                                )}`}
                            >
                                {user.status}
                            </div>
                        </div>

                        {/* Ngày tạo */}
                        <div
                            className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                                }`}
                        >
                            <label
                                className={`flex items-center gap-2 text-xs font-semibold mb-2 uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                    }`}
                            >
                                <Calendar size={14} />
                                Ngày tạo
                            </label>
                            <p
                                className={`text-sm px-2.5 py-1.5 rounded border ${theme === 'dark'
                                        ? 'bg-gray-800 border-gray-600 text-gray-200'
                                        : 'bg-white border-gray-300 text-gray-700'
                                    }`}
                            >
                                {user.createdAt}
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        className={`flex justify-end pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                            }`}
                    >
                        <button
                            type="button"
                            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 shadow-md hover:shadow-lg ${theme === 'dark'
                                    ? 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white'
                                    : 'bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white'
                                }`}
                            onClick={onClose}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailUserModal;