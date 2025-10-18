import React from 'react';
import { X, Mail, Phone, Shield, Calendar, User as UserIcon } from 'lucide-react';

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
            'Hoạt động': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
            'Không hoạt động': 'bg-gray-100 text-gray-600 border border-gray-300',
            'Bị cấm': 'bg-red-50 text-red-700 border border-red-200',
            'Đã xóa': 'bg-slate-100 text-slate-600 border border-slate-300',
        };
        return colors[status] || 'bg-gray-100 text-gray-600 border border-gray-300';
    };

    const getRoleBadgeColor = (role: string): string => {
        switch (role) {
            case 'ADMIN':
                return 'bg-red-100 text-red-700';
            case 'STAFF':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-4 flex items-center justify-between border-b-2 border-slate-900">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center font-bold text-lg">
                            {user.fullname.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{user.fullname}</h2>
                            <p className="text-slate-300 text-xs">@{user.username}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Tài khoản */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                                <UserIcon size={14} />
                                Tài khoản
                            </label>
                            <p className="text-sm font-mono bg-white px-2.5 py-1.5 rounded border border-gray-300 text-gray-700">
                                {user.username}
                            </p>
                        </div>

                        {/* Email */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                                <Mail size={14} />
                                Email
                            </label>
                            <p className="text-sm bg-white px-2.5 py-1.5 rounded border border-gray-300 text-gray-700 break-all">
                                {user.email}
                            </p>
                        </div>

                        {/* Số điện thoại */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                                <Phone size={14} />
                                Số điện thoại
                            </label>
                            <p className="text-sm bg-white px-2.5 py-1.5 rounded border border-gray-300 text-gray-700">
                                {user.phoneNumber}
                            </p>
                        </div>

                        {/* Vai trò */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                                <Shield size={14} />
                                Vai trò
                            </label>
                            <div className={`text-sm font-semibold px-2.5 py-1.5 rounded border ${getRoleBadgeColor(user.role)} text-center`}>
                                {getRoleLabel(user.role)}
                            </div>
                        </div>

                        {/* Trạng thái */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                                Trạng thái
                            </label>
                            <div className={`text-sm font-semibold px-2.5 py-1.5 rounded border text-center ${getStatusColor(user.status)}`}>
                                {user.status}
                            </div>
                        </div>

                        {/* Ngày tạo */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                                <Calendar size={14} />
                                Ngày tạo
                            </label>
                            <p className="text-sm bg-white px-2.5 py-1.5 rounded border border-gray-300 text-gray-700">
                                {user.createdAt}
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            className="px-5 py-2.5 bg-gradient-to-r from-slate-700 to-slate-800 text-white text-sm font-medium rounded-lg hover:from-slate-600 hover:to-slate-700 transition-all duration-150 shadow-md hover:shadow-lg"
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